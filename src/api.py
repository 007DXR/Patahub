from typing import Optional, List, Set, Union

import dbutils as dbop
from authorization import *

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import FastAPI, Path, Query, Body, Depends
from fastapi import HTTPException, Response, applications
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from pydantic import Field, BaseModel, BaseSettings

import pymysql

app = FastAPI(
    title="Patahub",
    version='0.0.1'
)

def swagger_monkey_patch(*args, **kwargs):
    """
    Wrap the function which is generating the HTML for the /docs endpoint and 
    overwrite the default values for the swagger js and css.
    """
    return get_swagger_ui_html(
        *args, **kwargs,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@3.29/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@3.29/swagger-ui.css")


# Actual monkey patch
applications.get_swagger_ui_html = swagger_monkey_patch

tags_metadata = [
    {
        "name": "user",
        "description": "Operations with user",
    },
    {
        "name": "paper",
        "description": "Operations with paper",
    },
    {
        "name": "dataset",
        "description": "Operations with dataset",
    },
    {
        "name": "codeset",
        "description": "Operations with codeset",
    },
    {
        "name": "result",
        "description": "Operations with result",
    },
    {
        "name": "rcd",
        "description": "Operations with rcd",
    },
]

class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"

class User(BaseModel):
    user_name: str # 用户名
    user_email: str # 用户邮箱
    user_password: str

class UserIndb(BaseModel):
    user_name: str
    user_email: str
    user_password_hash: str # 密文密码
    user_id: int # 用户id

class Result(BaseModel):
    result_value: float # 类型
    result_description: Optional[str] # 结果名 如figure1
    result_name: Optional[str]
    result_link:Optional[str]
    paper_id: int # 论文id
    

class ResultFrontend(Result):
    result_id: int # 结果id

class ResultIndb(ResultFrontend):
    user_id: int # 结果的用户

class Paper(BaseModel):
    paper_name: Optional[str] # 论文标题
    paper_link: Optional[str] # 论文链接
    paper_abstract: Optional[str] # 论文摘要
    docker_link: Optional[str] # docker链接
    codeset_link: Optional[str] # rcd中的codeset编号

class PaperFrontend(Paper):
    paper_id: int # 论文id

class PaperIndb(PaperFrontend):
    user_id: int # 论文的用户

class Dataset(BaseModel):
    dataset_name: Optional[str] # 数据集名称
    dataset_link: Optional[str] # 数据集链接

class DatasetFrontend(Dataset):
    dataset_id: int # 数据集id

class DatasetIndb(DatasetFrontend):
    user_id: int # 数据集的用户

# class Codeset(BaseModel):
#     # user_id: Optional[int] # 代码的用户
#     codeset_name: Optional[str] # 代码名
#     codeset_link: Optional[str] # 代码链接
#     codeset_id: Optional[int] # 代码编号

class RCD(BaseModel):
    paper_id: int # rcd中的paper编号
    result_id: int # rcd中的result编号
    dataset_id: Optional[int] # rcd中的dataset编号
    # codeset_id: Optional[int] # rcd中的codeset编号
    makefile: Optional[str] # make语句

class RCDFrontend(RCD):
    rcd_id: int # rcd编号

class RCDIndb(RCDFrontend):
    user_id: int # rcd的用户





# ------------------------------基本操作---------------------------------

# 启动
@app.on_event("startup")
async def startup_event():
    print('startup_event','-'*20)
    global db, conn
    (db, conn) = dbop.dbInit(host='123.57.48.134',user='patahub', \
        password='123456', database='patahub_db', port=3306)

@app.on_event("shutdown")
async def shutdown_event():
    print('shutdown_event','-'*20)
    conn.commit()
    conn.close()

# ------------------------------身份认证---------------------------------
def authenticate_user(user_name: str, password: str):
    user = dbop.dbGetUser(db, user_name=user_name)
    if len(user)==0:
        return False
    user=user[0]
    if not pwd_context.verify(password, user['user_password_hash']):
        return False
    return user

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # print('token_userid',token)
    token_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token=token, key=SECRET_KEY, algorithms=[ALGORITHM])
        user_name: str = payload.get("sub")
        # print('token_userid3',token_userid)
        if user_name is None:
            raise token_exception
    except:
        raise token_exception
    user = dbop.dbGetUser(db,user_name=user_name)[0]
    if not user:
        raise token_exception
    return user

async def get_current_userid(user: dict = Depends(get_current_user)):
    #print(user)
    return user['user_id']

# 主页
@app.get("/")
async def read_root():
    return {"Title": "Patahub"}

# -----------------------------用户操作------------------------------
# 用户注册
@app.post("/register", response_model=UserIndb, tags=["user"])
async def user_register(
    user_in: User
):
    if not user_in.user_name or not user_in.user_email or not user_in.user_password:
        raise HTTPException(400, detail="not complete")
    if len(dbop.dbGetUser(db, user_name=user_in.user_name)) != 0:
        raise HTTPException(400, detail="name already used")
    # if len(dbop.dbGetUser(db, user_in.user_email)) != 0:
    #     raise HTTPException(400, detail="email already registered")
    password_hash = pwd_context.hash(user_in.user_password)
    user_id = dbop.dbInsertUser(db, user_in.user_name, user_in.user_email, password_hash)
    return UserIndb(user_name=user_in.user_name,user_email=user_in.user_email, user_id=user_id, user_password_hash=password_hash)

# 用户登录
@app.post("/login", response_model=Token, tags=["user"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['user_name']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# 用户查看个人信息
@app.get("/userinfo", response_model=UserIndb, tags=['user'])
async def user_check_info(
    current_user: UserIndb = Depends(get_current_user)
):
    return current_user

# 用户修改信息
@app.put("/userinfo/{user_id}", response_model=UserIndb, tags=["user"])
async def user_modify_info(
    user_in: User,
    user_old_password: str,
    user_id: int = Depends(get_current_userid),
):
    curuser = dbop.dbGetUser(db, user_id=user_id)[0]
    # 验证原密码
    if not pwd_context.verify(user_old_password, curuser['user_password_hash']):
        raise HTTPException(status_code=400, detail="original password incorrect")
    # 用户名和邮箱不能为空
    if not user_in.user_name or not user_in.user_email:
        raise HTTPException(statue_code=400, detail="information not complete")
    # 不能重名
    if user_in.user_name!=dbop.dbGetUser(db, user_id=user_id)[0]['user_name'] \
    and len(dbop.dbGetUser(db,user_name= user_in.user_name)) != 0:
        raise HTTPException(status_code=400, detail="name already used")
    # 不能重复邮箱
    if user_in.user_email!=dbop.dbGetUser(db, user_id=user_id)[0]['user_email'] \
        and len(dbop.dbGetUser(db,user_email= user_in.user_email)) != 0:
        raise HTTPException(status_code=400, detail="email already registered")
    # 如果未填写新密码，则不修改密码
    user_new_password = user_in.user_password
    if user_new_password == '':
        user_new_password = user_old_password
    password_hash = pwd_context.hash(user_new_password)
    dbop.dbModifyUserInfo(db, user_id=user_id,new_name=user_in.user_name, new_email=user_in.user_email,new_password_hash= password_hash)
    return UserIndb(user_name=user_in.user_name,user_email=user_in.user_email, user_id=user_id, user_password_hash=password_hash)

# 用户查看自己的论文
@app.get("/userinfo/paper", tags=['user'])
async def get_my_paper(
    cur_user_id: int = Depends(get_current_userid)
):
    paperlist = dbop.dbGetPaperList(db, user_id=cur_user_id)
    return paperlist

# 用户查看自己的数据集
@app.get("/userinfo/dataset", tags=['user'])
async def get_my_dataset(
    cur_user_id: int = Depends(get_current_userid)
):
    datasetlist = dbop.dbGetDatasetList(db, user_id=cur_user_id)
    return datasetlist

# 用户查看自己的result
@app.get("/userinfo/result", tags=['user'])
async def get_my_result(
    cur_user_id: int = Depends(get_current_userid)
):
    resultlist = dbop.dbGetResultList(db, user_id=cur_user_id)
    return resultlist

#获取所有用户信息
@app.get("/allusers", tags=['user'])
async def get_all_user(
):
    userlist = dbop.dbGetUser(db)
    return userlist

# 获取其他用户信息
@app.get("/{user_id}/info", tags=['user'], response_model_exclude=['user_password_hash'])
async def get_others_info(
    user_id: int
):
    search_user = dbop.dbGetUser(db, user_id=user_id)
    return search_user[0]

# 获得其他用户的论文
@app.get("/{user_id}/paper", tags=['user'])
async def get_others_paper(
    user_id: int
):
    paperlist = dbop.dbGetPaperList(db, user_id=user_id)
    return paperlist

# 获得其他用户的数据集
@app.get("/{user_id}/dataset", tags=['user'])
async def get_others_dataset(
    user_id: int
):
    datasetlist = dbop.dbGetDatasetList(db, user_id=user_id)
    return datasetlist

# 获得其他用户的result
@app.get("/{user_id}/result", tags=['user'])
async def get_others_result(
    user_id: int
):
    resultlist = dbop.dbGetResultList(db, user_id=user_id)
    return resultlist

# -----------------------------查询操作------------------------------

# 论文列表
#response_model可以设置为List[Paper]
@app.get("/paper", tags=["paper"])
async def get_paper_list(
    paper_id: Union[int, None] = None,
    paper_name: Union[str, None] = None,
    user_id: Union[int, None] = None,
):
    paperlist = dbop.dbGetPaperList(db, paper_id=paper_id, paper_name=paper_name, user_id=user_id)
    return paperlist

# 数据集列表
#response_model可以设置为List[Dataset]
@app.get("/dataset", tags=["dataset"])
async def get_dataset_list(
    dataset_id: Union[int, None] = None,
    dataset_name: Union[str, None] = None,
    user_id: Union[int, None] = None,
):
    datasetlist = dbop.dbGetDatasetList(db, dataset_id=dataset_id, dataset_name=dataset_name, user_id=user_id)
    return datasetlist

# # Code列表
# @app.get("/codeset", tags=["codeset"])
# async def get_codeset_list(
#     codeset_id: Optional[int] = None,
#     codeset_name: Optional[str] = None,
#     user_id: Optional[int] = None,
# ):
#     code_list = dbop.dbGetCodesetList(db, codeset_id=codeset_id, codeset_name=codeset_name, user_id=user_id)
#     return code_list

# 结果列表
@app.get("/result", tags=["result"])
async def get_result_list(
    result_id: Union[int, None] = None,
    result_name: Union[str, None] = None,
    paper_id: Union[int, None] = None,
    user_id: Union[int, None] = None,
):
    resultlist = dbop.dbGetResultList(db, result_id=result_id, result_name=result_name, paper_id=paper_id, user_id=user_id)
    return resultlist

# 指定rcd的结果列表
@app.get("/result_in_rcd", tags=["result"])
async def get_result_in_rcd(
    rcd_id :int
):
    resultlist = dbop.dbGetResultInRCD(db, rcd_id=rcd_id)
    return resultlist

#RCD列表
@app.get("/rcd", tags=["rcd"])
async def get_rcd_list(
    rcd_id: Union[int, None] = None,
    result_id: Union[int, None] = None,
    dataset_id: Union[int, None] = None,
    paper_id: Union[int, None] = None,
    user_id: Union[int, None] = None,
):
    rcd = dbop.dbGetRCDList(db, rcd_id=rcd_id, result_id=result_id, dataset_id=dataset_id, paper_id=paper_id, user_id=user_id)
    return rcd

# -------------------------增添/更新操作-----------------------------

#新增论文
@app.post("/paper", response_model=PaperIndb, tags=["paper"])
async def post_paper(
    paper_in: Paper,
    cur_user_id: int = Depends(get_current_userid),
): 
    print('post_paper')
    if (not paper_in.paper_name) or (not paper_in.paper_link) :#or (not paper_in.paper_abstract):
        raise HTTPException(status_code=422)
    newid = dbop.dbInsertPaper(db, paper_in.paper_name, paper_in.paper_link, cur_user_id, paper_in.paper_abstract, paper_in.codeset_link, paper_in.docker_link)
    return PaperIndb(**paper_in.dict(), paper_id = newid, user_id=cur_user_id)

#更新论文
@app.put("/paper/{paper_id}",response_model=bool, tags=["paper"])
async def put_paper(
    paper_in: PaperFrontend,
    cur_user_id: int = Depends(get_current_userid),
):
    paper_user = dbop.dbGetPaperList(db,
        paper_id=paper_in.paper_id,
    )[0]["user_id"]
    if paper_user != cur_user_id:
        raise HTTPException(status_code=403, detail="no permission")
    result=dbop.dbUpdatePaper(db,
        user_id=cur_user_id,
        paper_id=paper_in.paper_id,
        paper_name=paper_in.paper_name,
        paper_link=paper_in.paper_link,
        paper_abstract=paper_in.paper_abstract,
        docker_link=paper_in.docker_link,
        codeset_link=paper_in.codeset_link
    )
    if result==None:
        raise HTTPException(status_code=403, detail="update failed")
    return result

#新增数据集
@app.post("/dataset", response_model=DatasetIndb, tags=["dataset"])
async def post_dataset(
    dataset_in: Dataset,
    cur_user_id: int = Depends(get_current_userid),
):
    if (not dataset_in.dataset_name) or (not dataset_in.dataset_link):
        raise HTTPException(status_code=422, detail="imformation not completed")
    newid = dbop.dbInsertDataset(db, dataset_in.dataset_name, dataset_in.dataset_link, cur_user_id)
    return DatasetIndb(**dataset_in.dict(), dataset_id=newid, user_id=cur_user_id)
  
       
#更新数据集
@app.put("/dataset/{dataset_id}", response_model=bool, tags=["dataset"])
async def put_dataset(
    dataset_in: DatasetFrontend,
    cur_user_id: int = Depends(get_current_userid),
):
    dataset_user = dbop.dbGetDatasetList(db, dataset_id=dataset_in.dataset_id)[0]["user_id"]
    if dataset_user != cur_user_id:
        raise HTTPException(status_code=403, detail="no permission")
    result=dbop.dbUpdateDataset(db,
        user_id=cur_user_id,
        dataset_id=dataset_in.dataset_id,
        dataset_name=dataset_in.dataset_name,
        dataset_link=dataset_in.dataset_link
    )
    if not result:
        raise HTTPException(status_code=403, detail="update failed")
    return result    

#更新code
# @app.put("/codeset/{codeset_id}", response_model=Codeset, tags=["codeset"])
# async def post_code(
    
#     codeset_in: Codeset,
#     cur_user_id: int = Depends(get_current_userid),
# ):
#     dbop.dbUpdateCodeset(db, user_id=cur_user_id,codeset_id=codeset_in.codeset_id, codeset_name=codeset_in.codeset_name, codeset_link=codeset_in.codeset_link)
#     if result==None:
#         raise HTTPException(status_code=403, detail="update failed")
#     return result    

#新增code
# @app.post("/codeset", response_model=Codeset, tags=["codeset"])
# async def post_code(
    
#     codeset_in: Codeset,
#     cur_user_id: int = Depends(get_current_user)
# ):
#     if (not codeset_in.codeset_name) or (not codeset_in.codeset_link):
#         raise HTTPException(status_code=422)
#     newid = dbop.dbInsertCodeset(db, codeset_name=codeset_in.codeset_name, codeset_link=codeset_in.codeset_link, user_id=cur_user_id)
#     codeset_in.codeset_id = newid
#     codeset_in.user_id=cur_user_id
#     return codeset_in
  

#新增result
@app.post("/result", response_model=ResultIndb, tags=["result"])
async def post_result(
    result_in: Result,
    cur_user_id: int = Depends(get_current_userid),
):
   
    if (not result_in.result_name) or   (not result_in.paper_id):
        raise HTTPException(status_code=422)
    newid = dbop.dbInsertResult(db, 
        result_name=result_in.result_name, 
        result_description=result_in.result_description, 
        result_value=result_in.result_value, 
        result_link=result_in.result_link,
        paper_id=result_in.paper_id, 
        user_id=cur_user_id)
    if not newid:
        raise HTTPException(status_code=400, detail="invalid type")
    return ResultIndb(**result_in.dict(), result_id=newid, user_id=cur_user_id)
   

#更新result
@app.put("/result/{result_id}", response_model=bool, tags=["result"])
async def put_result(
    result_in: ResultFrontend,
    cur_user_id: int = Depends(get_current_userid),
):
    if result_in.result_name:
        raise HTTPException(status_code=403, detail="result_name can't change")
    result_user = dbop.dbGetResultList(db, result_id=result_in.result_id)[0]["user_id"]
    if result_user != cur_user_id:
        raise HTTPException(status_code=403, detail="no permission")
    result=dbop.dbUpdateResult(db,
        user_id=cur_user_id,
        result_id=result_in.result_id, 
        # result_name=result_in.result_name, 
        result_description=result_in.result_description, 
        result_value=result_in.result_value,
        result_link=result_in.result_link
    )
    if not result:
        raise HTTPException(status_code=403, detail="update failed")
    return result

#新增RCD项
@app.post("/rcd", response_model=RCDIndb, tags=["rcd"])
async def post_rcd(
    rcd_in: RCD,
    cur_user_id: int = Depends(get_current_userid),
):
    
    if (not rcd_in.result_id) or (not rcd_in.paper_id) or (not rcd_in.dataset_id):
        raise HTTPException(status_code=422)
    if len(dbop.dbGetPaperList(db, rcd_in.paper_id)) == 0:
        raise HTTPException(status_code=404, detail="paper id invalid")
    if len(dbop.dbGetDatasetList(db, rcd_in.dataset_id)) == 0:
        raise HTTPException(status_code=404, detail="dataset id invalid")
    if len(dbop.dbGetResultList(db, rcd_in.result_id)) == 0:
        raise HTTPException(status_code=404, detail="result id invalid")
    # 用户只能使用自己创建的result 
    if (dbop.dbGetResultList(db, rcd_in.result_id)[0]['user_id']!=cur_user_id):
        raise HTTPException(status_code=404, detail="no permission to use this result")
    
    newid = dbop.dbInsertRCD(db, rcd_in.result_id,  rcd_in.dataset_id, rcd_in.paper_id, cur_user_id, rcd_in.makefile)
    dbop.dbInsertRCD_result(db,rcd_id=newid,result_id=rcd_in.result_id)
    return RCDIndb(**rcd_in.dict(), rcd_id=newid, user_id=cur_user_id)
  

#更新RCD项
@app.put("/rcd/{rcd_id}", response_model=bool, tags=["rcd"])
async def put_rcd(
    # rcd_in: RCDFrontend,
    rcd_id: int,
    dataset_id: Union[int, None] = None,
    makefile: Union[str, None] = None,
    cur_user_id: int = Depends(get_current_userid),
):
# # 用户只能使用自己创建的result 
#     if rcd_in.result_id:
#         rcd_users = dbop.dbGetResultList(db, result_id=rcd_in.result_id)
#         if len (rcd_users)==0 or rcd_users[0]["user_id"] != cur_user_id:
#             raise HTTPException(status_code=403, detail="no permission to use this result")
# 用户只能修改自己创建的rcd 
    # rcd_user = dbop.dbGetRCDList(db, rcd_id=rcd_in.rcd_id)[0]["user_id"]
    # if rcd_user != cur_user_id:
    #     raise HTTPException(status_code=403, detail="no permission")
    # result=dbop.dbUpdateRCD(db,
    #     user_id=cur_user_id,
    #     rcd_id=rcd_in.rcd_id,
    #     dataset_id=rcd_in.dataset_id, 
    #     makefile=rcd_in.makefile
    # )
    rcd_user = dbop.dbGetRCDList(db, rcd_id=rcd_id)[0]["user_id"]
    if rcd_user != cur_user_id:
        raise HTTPException(status_code=403, detail="no permission")
    if len(dbop.dbGetDatasetList(db,dataset_id=dataset_id))==0:
        raise HTTPException(status_code=403, detail="can't find dataset")
    result=dbop.dbUpdateRCD(db,
        user_id=cur_user_id,
        rcd_id=rcd_id,
        dataset_id=dataset_id, 
        makefile=makefile
    )
    if not result:
        raise HTTPException(status_code=403, detail="update failed")
    return result

#将result填入RCD项
@app.post("/rcd/{rcd_id}", response_model=bool, tags=["rcd"])
async def add_result_into_rcd(
    rcd_id: int,
    result_id: int,
    cur_user_id: int = Depends(get_current_userid),
):
    rcd_users=dbop.dbGetRCDList(db, rcd_id=rcd_id)
    if len (rcd_users) and rcd_users[0]["user_id"] == cur_user_id:
        raise HTTPException(status_code=403, detail="please modify directly")
    # 用户只能使用自己创建的result 
    rcd_users = dbop.dbGetResultList(db, result_id=result_id)
    if len (rcd_users)==0 or rcd_users[0]["user_id"] != cur_user_id:
        raise HTTPException(status_code=403, detail="no permission to use this result")

    result=dbop.dbInsertRCD_result(db,
        rcd_id=rcd_id,
        result_id=result_id
    )
    if not result:
        raise HTTPException(status_code=403, detail="update failed")
    return result


# --------------------------删除操作-----------------------------

#将result从RCD项删除
@app.delete("/rcd/{rcd_id}", response_model=bool, tags=["rcd"])
async def delete_result_into_rcd(
    rcd_id: int,
    result_id: int,
    cur_user_id: int = Depends(get_current_userid),
):
    # 用户只能删除自己创建的result 
    rcd_user = dbop.dbGetResultList(db, result_id=result_id)[0]["user_id"]
    if rcd_user != cur_user_id:
        raise HTTPException(status_code=403, detail="no permission to use this result")

    result=dbop.dbDeleteRCD_result(db,
        rcd_id=rcd_id,
        result_id=result_id
    )
    if not result:
        raise HTTPException(status_code=403, detail="update failed")
    return result
#删除论文
@app.delete("/paper", tags=["paper"])
async def delete_paper(
    paper_id: int,
    cur_user_id: int = Depends(get_current_userid),
):
    cur_paper = dbop.dbGetPaperList(db, paper_id=paper_id)
    if len(cur_paper) == 0:
        raise HTTPException(status_code=404, detail="paper id not found")
    if cur_user_id != cur_paper[0]["user_id"]:
        raise HTTPException(status_code=403, detail="no permission")
    dbop.dbDeletePaper(db, paper_id)
    dbop.dbDeleteRCD(db,user_id=cur_user_id, paper_id=paper_id)
    return paper_id
    
#删除数据集
@app.delete("/dataset", tags=["dataset"])
async def delete_dataset(
    dataset_id: int,
    cur_user_id: int = Depends(get_current_userid),
):
    cur_dataset = dbop.dbGetDatasetList(db, dataset_id=dataset_id)
    if len(cur_dataset) == 0:
        raise HTTPException(status_code=404, detail="dataset id not found")
    if cur_user_id != cur_dataset[0]["user_id"]:
        raise HTTPException(status_code=403, detail="no permission")
    dbop.dbDeleteDataset(db, dataset_id)
    dbop.dbDeleteRCD(db, user_id=cur_user_id, dataset_id=dataset_id)
    return dataset_id
    
#删除代码
# @app.delete("/codeset", tags=["codeset"])
# async def delete_code(
#     codeset_id: int,
#     cur_user_id: int = Depends(get_current_userid),
# ):
#     cur_codeset = dbop.dbGetCodesetList(db, codeset_id=codeset_id)
#     if len(cur_codeset) == 0:
#         raise HTTPException(status_code=404, detail="code id not found")
#     if cur_user_id != cur_codeset[0]['user_id']:
#         raise HTTPException(status_code=403, detail="no permission")
#     dbop.dbDeleteCodeset(db, codeset_id)
#     dbop.dbDeleteRCD(db, codeset_id=codeset_id)
#     return codeset_id

#删除结果
@app.delete("/result", tags=["result"])
async def delete_result(
    result_id: int,
    cur_user_id: int = Depends(get_current_userid),
):
    cur_result = dbop.dbGetResultList(db, result_id)
    if len(cur_result) == 0:
        raise HTTPException(status_code=404, detail="result id not found")
    if cur_user_id != cur_result[0]['user_id']:
        raise HTTPException(status_code=403, detail="no permission")
    dbop.dbDeleteResult(db, result_id)
    dbop.dbDeleteRCD(db,user_id=cur_user_id,  result_id=result_id)
    return result_id

#删除RCD项
@app.delete("/rcd", tags=["rcd"])
async def delete_rcd(
    rcd_id: Union[int, None] = None,
    result_id: Union[int, None] = None,
    dataset_id: Union[int, None] = None,
    paper_id: Union[int, None] = None,
    cur_user_id: int = Depends(get_current_userid),
):
    cur_rcd = dbop.dbGetRCDList(db, rcd_id)
    if len(cur_rcd) == 0:
        raise HTTPException(status_code=404, detail="rcd id not found")
    if cur_user_id != cur_rcd[0]['user_id']:
        raise HTTPException(status_code=403, detail="no permission")
    dbop.dbDeleteRCD(db, user_id=cur_user_id,rcd_id=rcd_id, result_id=result_id,
        dataset_id=dataset_id,paper_id=paper_id)
    return {"status": "success"}


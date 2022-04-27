from typing import Optional, List, Set
import dbutils as dbop

from fastapi import FastAPI, Path, Query, Body, HTTPException, Response
from pydantic import Field, BaseModel, BaseSettings
import signal


app = FastAPI(
    title="Patahub",
    version='0.0.1'
)

@app.on_event("startup")
async def startup_event():
    global db, conn
    (db, conn) = dbop.dbInit('database.db')

@app.on_event("shutdown")
async def shutdown_event():
    #dbop.dbClear('database.db')
    conn.commit()
    conn.close()

class Result(BaseModel):
    user_id: int
    result_type: str # 类型
    result_name: Optional[str] # 结果名 如figure1
    result_link: Optional[str] # 链接
    paper_id: int # 论文id
    result_id: Optional[int] # 结果id

class Paper(BaseModel):
    user_id: int # 论文的用户
    paper_name: Optional[str] # 论文标题
    paper_link: Optional[str] # 论文链接
    paper_id: Optional[int] # 论文id
    paper_abstract: Optional[str] # 论文摘要

class Dataset(BaseModel):
    user_id: int #数据集的用户
    dataset_name: Optional[str] # 数据集名称
    dataset_link: Optional[str] # 数据集链接
    dataset_id: Optional[int] # 数据集id

class Codeset(BaseModel):
    user_id: int # 代码的用户
    codeset_name: Optional[str] # 代码名
    codeset_link: Optional[str] # 代码链接
    codeset_id: Optional[int] # 代码编号

class RCD(BaseModel):
    user_id: int
    paper_id: int # rcd中的paper编号
    result_id: int # rcd中的result编号
    dataset_id: Optional[int] # rcd中的dataset编号
    codeset_id: Optional[int] # rcd中的codeset编号
    data_link: Optional[str] # 数据链接
    code_link: Optional[str] # 代码链接
    rcd_id: Optional[int] # rcd编号


#主页
@app.get("/")
async def read_root():
    return {"Title": "Patahub"}

# -----------------------------查询操作------------------------------

# 论文列表
#response_model可以设置为List[Paper]
@app.get("/paper")
async def get_paper_list(
    paper_id: Optional[int] = None,
    paper_name: Optional[str] = None,
    user_id: Optional[int] = None,
):
    paperlist = dbop.dbGetPaperList(db, paper_id=paper_id, paper_name=paper_name, user_id=user_id)
    return paperlist

# 数据集列表
#response_model可以设置为List[Dataset]
@app.get("/dataset")
async def get_dataset_list(
    dataset_id: Optional[int] = None,
    dataset_name: Optional[str] = None,
    user_id: Optional[int] = None,
):
    datasetlist = dbop.dbGetDatasetList(db, dataset_id=dataset_id, dataset_name=dataset_name, user_id=user_id)
    return datasetlist

# Code列表
@app.get("/codeset")
async def get_codeset_list(
    codeset_id: Optional[int] = None,
    codeset_name: Optional[str] = None,
    user_id: Optional[int] = None,
):
    code_list = dbop.dbGetCodesetList(db, codeset_id=codeset_id, codeset_name=codeset_name, user_id=user_id)
    return code_list

# 结果列表
@app.get("/result")
async def get_result_list(
    result_id: Optional[int] = None,
    result_type: Optional[str] = None,
    result_name: Optional[str] = None,
    paper_id: Optional[int] = None,
    user_id: Optional[int] = None
):
    resultlist = dbop.dbGetResultList(db, result_id=result_id, result_name=result_name, result_type=result_type, paper_id=paper_id, user_id=user_id)
    return resultlist

#RCD列表
@app.get("/rcd")
async def get_rcd_list(
    rcd_id: Optional[int] = None,
    result_id: Optional[int] = None,
    codeset_id: Optional[int] = None,
    dataset_id: Optional[int] = None,
    paper_id: Optional[int] = None,
    user_id: Optional[int] = None
):
    rcd = dbop.dbGetRCDList(db, rcd_id=rcd_id, result_id=result_id, codeset_id=codeset_id, dataset_id=dataset_id, paper_id=paper_id, user_id=user_id)
    return rcd

# -------------------------增添/更新操作-----------------------------

#新增/更新论文
@app.post("/paper", response_model=Paper)
async def post_paper(
    paper_in: Paper
):
    if paper_in.paper_id == None:
        # 新建
        if (not paper_in.paper_name) or (not paper_in.paper_link) or (not paper_in.paper_abstract):
            raise HTTPException(status_code=422)
        newid = dbop.dbInsertPaper(db, paper_in.paper_name, paper_in.paper_link, paper_in.user_id, paper_in.paper_abstract)
        paper_in.paper_id = newid
        return paper_in
    else:
        # 更新
        dbop.dbUpdatePaper(db, paper_in.paper_id, paper_name=paper_in.paper_name, paper_link=paper_in.paper_link, paper_abstract=paper_in.paper_abstract)

#新增/更新数据集
@app.post("/dataset", response_model=Dataset)
async def post_dataset(
    dataset_in: Dataset
):
    if dataset_in.dataset_id == None:
        # 新建
        if (not dataset_in.dataset_name) or (not dataset_in.dataset_link):
            raise HTTPException(status_code=422)
        newid = dbop.dbInsertDataset(db, dataset_in.dataset_name, dataset_in.dataset_link, dataset_in.user_id)
        dataset_in.dataset_id = newid
        return dataset_in
    else:
        # 更新
        dbop.dbUpdateDataset(db, dataset_in.dataset_id, dataset_name=dataset_in.dataset_name, dataset_link=dataset_in.dataset_link)

#新增/更新code
@app.post("/codeset", response_model=Codeset)
async def post_code(
    codeset_in: Codeset
):
    if codeset_in.codeset_id == None:
        # 新建
        if (not codeset_in.codeset_name) or (not codeset_in.codeset_link) or (not codeset_in.user_id):
            raise HTTPException(status_code=422)
        newid = dbop.dbInsertCodeset(db, codeset_in.codeset_name, codeset_in.codeset_link, codeset_in.user_id)
        codeset_in.codeset_id = newid
        return codeset_in
    else:
        # 更新
        dbop.dbUpdateCodeset(db, codeset_in.codeset_id, codeset_name=codeset_in.codeset_name, codeset_link=codeset_in.codeset_link)

#新增/更新result
@app.post("/result", response_model=Result)
async def post_result(
    result_in: Result
):
    if result_in.result_id == None:
        # 新建
        if (not result_in.result_name) or (not result_in.result_link) \
            or (not result_in.result_type) or (not result_in.paper_id):
            raise HTTPException(status_code=422)
        newid = dbop.dbInsertResult(db, result_in.result_type, result_in.result_name, result_in.result_link, result_in.paper_id, result_in.user_id)
        if not newid:
            raise HTTPException(status_code=400, detail="invalid type")
        result_in.result_id = newid
        return result_in
    else:
        # 更新
        dbop.dbUpdateResult(db, result_in.result_id, result_name=result_in.result_name, result_link=result_in.result_link)

#新增/更新RCD项
@app.post("/rcd", response_model=RCD)
async def post_rcd(
    rcd: RCD
):
    if rcd.rcd_id == None:
        # 新建
        if (not rcd.result_id) or (not rcd.paper_id) or (not rcd.dataset_id) \
            or (not rcd.codeset_id) or (not rcd.data_link) or (not rcd.code_link) or (not rcd.user_id):
            raise HTTPException(status_code=422)
        if len(dbop.dbGetPaperList(db, rcd.paper_id)) == 0:
            raise HTTPException(status_code=404, detail="paper id invalid")
        if len(dbop.dbGetDatasetList(db, rcd.dataset_id)) == 0:
            raise HTTPException(status_code=404, detail="dataset id invalid")
        if len(dbop.dbGetResultList(db, rcd.result_id)) == 0:
            raise HTTPException(status_code=404, detail="result id invalid")
        if len(dbop.dbGetCodesetList(db, rcd.codeset_id)) == 0:
            raise HTTPException(status_code=404, detail="code id invalid")
        newid = dbop.dbInsertRCD(db, rcd.result_id, rcd.codeset_id, rcd.code_link, rcd.dataset_id, rcd.data_link, rcd.paper_id, rcd.user_id)
        rcd.rcd_id = newid
        return rcd.dict()
    else:
        # 更新
        if len(dbop.dbGetRCDList(db, rcd_id=rcd.rcd_id, result_id=rcd.result_id,
            codeset_id=rcd.codeset_id, dataset_id=rcd.dataset_id, paper_id=rcd.paper_id, user_id=rcd.user_id)) == 0:
            raise HTTPException(status_code=404, detail="rcd not found")
        dbop.dbUpdateRCD(db, rcd.rcd_id, result_id=rcd.result_id,
            codeset_id=rcd.codeset_id, code_link=rcd.code_link,
            dataset_id=rcd.dataset_id, data_link=rcd.data_link,
            paper_id=rcd.paper_id)

# --------------------------删除操作-----------------------------

#删除论文
@app.delete("/paper")
async def delete_paper(
    paper_id: int
):
    if len(dbop.dbGetPaperList(db, paper_id)) == 0:
        raise HTTPException(status_code=404, detail="paper id not found")
    dbop.dbDeletePaper(db, paper_id)
    dbop.dbDeleteRCD(db, paper_id=paper_id)
    return paper_id
    
#删除数据集
@app.delete("/dataset")
async def delete_dataset(
    dataset_id: int
):
    if len(dbop.dbGetDatasetList(db, dataset_id)) == 0:
        raise HTTPException(status_code=404, detail="dataset id not found")
    dbop.dbDeleteDataset(db, dataset_id)
    dbop.dbDeleteRCD(db, dataset_id=dataset_id)
    return dataset_id
    
#删除代码
@app.delete("/codeset")
async def delete_code(
    codeset_id: int
):
    if len(dbop.dbGetCodesetList(db, codeset_id)) == 0:
        raise HTTPException(status_code=404, detail="code id not found")
    dbop.dbDeleteCodeset(db, codeset_id)
    dbop.dbDeleteRCD(db, codeset_id=codeset_id)
    return codeset_id

#删除结果
@app.delete("/result")
async def delete_result(
    result_id: int
):
    if len(dbop.dbGetResultList(db, result_id)) == 0:
        raise HTTPException(status_code=404, detail="result id not found")
    dbop.dbDeleteResult(db, result_id)
    dbop.dbDeleteRCD(db, result_id=result_id)
    return result_id

#删除RCD项
@app.delete("/rcd")
async def delete_rcd(
    rcd_id: Optional[int] = None,
    result_id: Optional[int] = None,
    codeset_id: Optional[int] = None,
    dataset_id: Optional[int] = None,
    paper_id: Optional[int] = None
):
    dbop.dbDeleteRCD(db, rcd_id=rcd_id, result_id=result_id,
        codeset_id=codeset_id, dataset_id=dataset_id,
        paper_id=paper_id)
    return {"status": "success"}

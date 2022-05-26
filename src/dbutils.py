import sqlite3
import unittest
import os
import random
import string
from pymysql.converters import escape_string 

def dbClear(database_filename):
    conn = sqlite3.connect(database_filename, check_same_thread=False)
    db = conn.cursor()
    db.execute("drop table datasets")
    db.execute("drop table papers")
    db.execute("drop table codesets")
    db.execute("drop table results")
    db.execute("drop table rcds")
    db.execute("drop table users")
    conn.commit()
    conn.close()

# 链接并初始化数据库


def dbInit(database_filename):
    conn = sqlite3.connect(database_filename, check_same_thread=False)
    db = conn.cursor()
    # 初始化表
    db.execute('''CREATE TABLE IF NOT EXISTS papers
                (
                    paper_id int primary key,
                    paper_name text,
                    paper_link text,
                    user_id int,
                    paper_abstract text,
                    codeset_link text,
                    docker_link text
                );''')
    db.execute('''CREATE TABLE IF NOT EXISTS datasets
                (
                    dataset_id int primary key,
                    dataset_name text,
                    dataset_link text,
                    user_id int
                );''')
    db.execute('''CREATE TABLE IF NOT EXISTS codesets
                (
                    codeset_id int primary key,
                    codeset_name text,
                    codeset_link text,
                    user_id int
                );''')
    db.execute('''CREATE TABLE IF NOT EXISTS results
                (
                    result_id int primary key,
                    result_name text,
                    result_description text,
                    result_value float,
                    paper_id int,
                    user_id int
                );''')
    db.execute('''CREATE TABLE IF NOT EXISTS rcds
                (
                    rcd_id int,
                    result_id int,
                    dataset_id int,
                    paper_id int,
                    user_id int,
                    makefile text
                );''')
    db.execute('''CREATE TABLE IF NOT EXISTS users
                (
                    user_id int primary key,
                    user_name text,
                    user_email text,
                    user_password_hash text
                );''')
    return (db, conn)

# -------------------- 用户相关users ---------------------
# 新增用户
def dbInsertUser(db, name, email, password):
    curuserlist = db.execute("SELECT user_id FROM users;")
    mxid = 0
    for row in curuserlist:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    db.execute("""INSERT INTO users VALUES
                (?,?,?,?);""", (mxid, name, email, password))
    return mxid

# 查询用户
def dbGetUser(db, user_id=None, user_name=None, user_email=None):
    exec = """SELECT * FROM users WHERE true """
    args=[]
    if user_id:
        exec += """and (user_id = ?) """ 
        args.append(user_id)
    if user_name:
        exec += """and (user_name = ?) """ 
        args.append(user_name)
    if user_email:
        exec += """and (user_email= ?) """ 
        args.append(user_id)
    result = db.execute(exec,tuple(args))
    # print('dbGetUser',result,result.fetchall())
    return [{'user_id': row[0], 'user_name':row[1], 'user_email':row[2], 'user_password_hash':row[3]} for row in result]

# 更新用户信息
def dbModifyUserInfo(db, user_id, new_name=None, new_password_hash=None, new_email=None):
    if new_name != None:
        db.execute("""update users SET user_name=? WHERE user_id=?;""",(new_name, user_id))

    if new_password_hash != None:
        db.execute("""update users SET user_password_hash=? WHERE user_id=?;""",(new_password_hash, user_id))
    if new_email != None:
        db.execute("""update users SET user_email=? WHERE user_id=?;""",(new_email, user_id))

# -------------------- 论文相关papers --------------------
# 新增论文
def dbInsertPaper(db, title, link, user_id, abstract,codeset_link,docker_link):
    curresult = db.execute("SELECT paper_id FROM papers;")
    mxid = 0
    for row in curresult:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    db.execute("""INSERT INTO papers VALUES
                (?,?,?,?,?,?,?);""", (mxid, title, link, user_id, abstract, codeset_link, docker_link))
    return mxid

# 综合检索论文
def dbGetPaperList(db, paper_id=None, paper_name=None, user_id=None):
    exec = """SELECT * FROM papers WHERE true """
    args=[]
    if paper_id:
        exec += """and (paper_id = ?) """ 
        args.append(paper_id)
    if paper_name:
        exec += """and (paper_name like ?) """ 
        args.append("%"+paper_name+"%")
    if user_id:
        exec += """and (user_id = ?) """ 
        args.append(user_id)
    result = db.execute(exec,tuple(args))
    print(exec)
    return [{'paper_id': row[0], 'paper_name':row[1], 'paper_link':row[2], 'user_id':row[3],
        'paper_abstract':row[4], 'codeset_link':row[5], 'docker_link':row[6]} 
        for row in result]

# 更新papers表的paper_name,paper_link
def dbUpdatePaper(db,user_id,paper_id,paper_name=None,paper_link=None, paper_abstract=None, codeset_link=None, docker_link=None):
    results=db.execute("""select * from papers WHERE paper_id = ? and user_id=?;""",(paper_id,user_id)).fetchall()
    if not results:
        return False
    if paper_name:
        db.execute("""update papers SET  paper_name=? WHERE paper_id = ? and user_id = ?;""",(paper_name,paper_id,user_id))
    if paper_link:
        db.execute("""update papers SET  paper_link=? WHERE paper_id = ?  and user_id = ?;""",(paper_link,paper_id,user_id))
    if paper_abstract:
        db.execute("""update papers SET  paper_abstract=? WHERE paper_id = ? and user_id = ?;""",(paper_abstract,paper_id,user_id))
    if codeset_link:
        db.execute("""update papers SET  codeset_Link=? WHERE paper_id = ? and user_id = ?;""",(codeset_link,paper_id,user_id))
    if docker_link:
        db.execute("""update papers SET  docker_link=? WHERE paper_id = ? and user_id = ?;""",(docker_link,paper_id,user_id))
    return True
    # result=db.execute("""select * from papers WHERE paper_id = ? and user_id=?;""",(paper_id,user_id))
    # for row in result:
    #     return {'paper_id': row[0], 'paper_name':row[1], 'paper_link':row[2], 'user_id':row[3], 'paper_abstract':row[4],'docker_link':row[5]} 
    # return list(results)[0]

# 删除论文
def dbDeletePaper(db, paper_id):
    result = db.execute("""DELETE FROM papers WHERE paper_id = ?""", (paper_id,))
    return result

# -------------------- 数据集相关datasets --------------------
# 新增数据集
def dbInsertDataset(db, dataset_name, dataset_link, user_id):
    currresult = db.execute("SELECT dataset_id FROM datasets;")
    mxid = 0
    for row in currresult:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    db.execute("""INSERT INTO datasets VALUES
                    (?,?,?,?);""", (mxid, dataset_name, dataset_link, user_id))
    return mxid

# 综合检索数据集
def dbGetDatasetList(db, dataset_id=None, dataset_name=None, user_id=None):
    exec = """SELECT * FROM datasets where true """
    args=[]
    if dataset_id:
        exec += """and (dataset_id =?) """ 
        args.append(dataset_id)
    if dataset_name:
        exec += """and  (dataset_name like ?) """
        args.append("%"+dataset_name+"%")
    if user_id:
        exec += """and  (user_id = ?) """
        args.append(user_id)
    result = db.execute(exec,tuple(args))

    return [{'dataset_id': row[0], 'dataset_name':row[1], 'dataset_link':row[2], 'user_id':row[3]} for row in result]

# 更新datasets表的dataset_name,dataset_link
def dbUpdateDataset(db,user_id,dataset_id,dataset_name=None,dataset_link=None):
    results=db.execute("""select * from datasets WHERE dataset_id = ? and user_id=?;""",(dataset_id,user_id)).fetchall()
    if not results:
        return False
    if dataset_name:
        db.execute("""update datasets SET  dataset_name=? WHERE dataset_id = ?  and user_id=?;""",(dataset_name,dataset_id,user_id))
    if dataset_link:
        db.execute("""update datasets SET  dataset_link=? WHERE dataset_id = ?  and user_id=?;""",(dataset_link,dataset_id,user_id))
    return True

# 删除数据集
def dbDeleteDataset(db, dataset_id):
    result = db.execute("""DELETE FROM datasets WHERE dataset_id = ?;""", (dataset_id,))
    return result

# -------------------- 代码集相关codesets --------------------
# 新增代码集
def dbInsertCodeset(db, codeset_name, codeset_link, user_id):
    currresult = db.execute("SELECT codeset_id FROM codesets;")
    mxid = 0
    for row in currresult:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    db.execute("""INSERT INTO codesets VALUES
                    (?,?,?,?);""", (mxid, codeset_name, codeset_link, user_id))
    return mxid

# 综合查询codesets列表
def dbGetCodesetList(db, codeset_id=None, codeset_name=None, user_id=None):
    exec="""SELECT * FROM codesets WHERE true """
    args=[]
    if codeset_id:
        exec+="""and (codeset_id = ?) """
        args.append(codeset_id)
    if codeset_name:
        exec+="""and  (codeset_name like ?) """
        args.append("%"+codeset_name+"%")
    if user_id:
        exec+="""and  (user_id = ?) """
        args.append(user_id)
    result=db.execute(exec,tuple(args))
    return [{'codeset_id': row[0], 'codeset_name':row[1], 'codeset_link':row[2], 'user_id':row[3]} for row in result]

# 更新codesets表的codeset_name,codeset_link
# def dbUpdateCodeset(db,user_id,codeset_id,codeset_name=None,codeset_link=None):
#     if codeset_name:
#         db.execute("""update codesets SET  codeset_name=? WHERE codeset_id = ? and user_id=?;""",(codeset_name,codeset_id,user_id))
        
#     if codeset_link:
        
#         db.execute("""update codesets SET  codeset_link=? WHERE codeset_id = ? and user_id=?;""",(codeset_link,codeset_id,user_id))
       

# 删除 codeset
# def dbDeleteCodeset(db, codeset_id):
#     result = db.execute("""DELETE FROM codesets WHERE codeset_id = ?;""", (codeset_id,))
#     return result

# -------------------- 结果集相关 result --------------------
# 新增 result
def dbInsertResult(db, result_name, result_description, result_value, paper_id, user_id):
    # if (result_type not in ("link", "img", "csv", "other", "bin")):
    #     return False
    result = db.execute("SELECT result_id FROM results;")
    mxid = 0
    for row in result:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    # mxid=db.execute("select count(*) from results ")[0][0]+1
    db.execute("""INSERT INTO results VALUES
                    (?,?,?,?,?,?);""", (mxid, result_name, result_description,result_value, paper_id, user_id))
    return mxid

# 综合查询result列表
def dbGetResultList(db, result_id=None, result_name=None, paper_id=None, user_id=None):
    exec="""SELECT * FROM results where true """
    args=[]
    if result_id:
        exec+="""and (result_id =?) """
        args.append(result_id)
    # if result_type:
    #     exec+="""and (result_type = ?) """
    #     args.append(result_type)
    if result_name:
        exec+="""and (result_name like ?) """
        args.append("%"+result_name+"%")
    if paper_id:
        exec+="""and (paper_id = ?) """
        args.append(paper_id)
    if user_id:
        exec+="""and (user_id = ?) """
        args.append(user_id)
    ret=db.execute(exec,tuple(args))
    return [{'result_id': row[0], 'result_name':row[1], 'result_description':row[2],'result_value':row[3], 'paper_id':row[4], 'user_id':row[5]} for row in ret]

# 删除 result
def dbDeleteResult(db, result_id):
    result = db.execute("""DELETE FROM results WHERE result_id = ?;""", (result_id,))
    return result

# 更新results表的result_name,result_link
def dbUpdateResult(db,user_id,result_id,result_name=None,result_description=None,result_value=None):
    results=db.execute("""select * from results WHERE result_id = ? and user_id=?;""",(result_id,user_id)).fetchall()
    if not results:
        return False

    if result_name:
        db.execute("""update results SET  result_name=? WHERE result_id = ?  and user_id=?;""",(result_name,result_id,user_id))
    if result_description:
        db.execute("""update results SET  result_description= ? WHERE result_id = ?  and user_id=?;""",(result_description,result_id,user_id))
    if result_value:
        db.execute("""update results SET  result_value= ? WHERE result_id = ?  and user_id=?;""",(result_value,result_id,user_id))
    return True

# -------------------- RCD 相关 --------------------
# 新增 RCD 项
def dbInsertRCD(db, result_id ,dataset_id,paper_id, user_id,makefile):
    result = db.execute("SELECT rcd_id FROM rcds;")
    mxid = 0
    for row in result:
        mxid = max(mxid, row[0])
    mxid = mxid + 1

    db.execute("""INSERT INTO rcds VALUES
                    (?,?,?,?,?,?);""", (mxid,result_id,dataset_id,paper_id, user_id,makefile))
    return mxid

# 综合查询RCD列表
def dbGetRCDList(db, rcd_id=None, result_id=None,dataset_id=None ,paper_id=None, user_id=None):
    exec = """SELECT * FROM rcds WHERE true """
    args=[]
    if rcd_id:
        exec += """and (rcd_id =?)"""
        args.append(rcd_id)
    if paper_id:
        exec += """and (paper_id = ?)"""
        args.append(paper_id)
    if result_id:
        exec += """and (result_id = ?) """
        args.append(result_id)
    if dataset_id:
        exec += """and (dataset_id = ?)"""
        args.append(dataset_id)
    # if codeset_id:
    #     exec += """and (codeset_id = ?)"""
    #     args.append(codeset_id)
    if user_id:
        exec += """and (user_id = ?)"""
        args.append(user_id)
    result = db.execute(exec,tuple(args))

    return [{'rcd_id': row[0], 'result_id': row[1],  'dataset_id':row[2], 
    'paper_id':row[3], 'user_id':row[4],'makefile':row[5]} 
    for row in result]

# 删除 RCD
def dbDeleteRCD(db, user_id,rcd_id=None, result_id=None, dataset_id=None,paper_id=None):
    exec="""DELETE FROM rcds WHERE user_id=? and(false """
    args=[user_id]
    if rcd_id:
        exec+=""" or (rcd_id = ?) """
        args.append(rcd_id)
    if result_id:
        exec+=""" or (result_id = ?) """
        args.append(result_id)
    # if codeset_id:
    #     exec+=""" or (codeset_id = ?) """
    #     args.append(codeset_id)
    if dataset_id:
        exec+=""" or (dataset_id = ?) """
        args.append(dataset_id)
    if paper_id:
        exec+=""" or (paper_id = ?) """
        args.append(paper_id)
    exec+=''');'''
    result = db.execute(exec,tuple(args))
    return result

# 更新 rcd 表
def dbUpdateRCD(db, user_id,rcd_id, result_id = None,   dataset_id = None,makefile=None):
    results=db.execute("""select * from rcds WHERE rcd_id = ? and user_id=?;""",(rcd_id,user_id)).fetchall()
    if not results:
        return False

    exec = []
    args=[]
    if result_id:
        exec.append("""result_id = ?""" )
        args.append(result_id)
    # if codeset_id:
    #     exec.append("""codeset_id = ?""" )
    #     args.append(codeset_id)
    if dataset_id:
        exec.append("""dataset_id = ?""" )
        args.append(dataset_id)
    if makefile:
        exec.append("""makefile = ?""" )
        args.append(makefile)
    if exec != []:
        exec = "UPDATE rcds SET " + ",".join(exec) + " WHERE rcd_id = ? and user_id=?;"
        args.append(rcd_id)
        args.append(user_id)
        result = db.execute(exec,tuple(args))
        print("dbUpdateRCD",result)
        return True
    return False

if __name__=='__main__':
    dbInit('20220522.db')

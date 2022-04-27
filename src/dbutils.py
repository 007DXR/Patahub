import sqlite3
import unittest
import os
import random
import string


def dbClear(database_filename):
    conn = sqlite3.connect(database_filename, check_same_thread=False)
    db = conn.cursor()
    db.execute("drop table datasets")
    db.execute("drop table papers")
    db.execute("drop table codesets")
    db.execute("drop table results")
    db.execute("drop table rcds")
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
                    paper_abstract text
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
                    result_link text,
                    result_type text,
                    paper_id int,
                    user_id int
                );''')
    db.execute('''CREATE TABLE IF NOT EXISTS rcds
                (
                    rcd_id int,
                    result_id int,
                    codeset_id int,
                    code_link text,
                    dataset_id int,
                    data_link text,
                    paper_id int,
                    user_id int
                );''')
    return (db, conn)

# -------------------- 论文相关papers --------------------
# 新增论文
def dbInsertPaper(db, title, link, user_id, abstract):
    curresult = db.execute("SELECT paper_id FROM papers;")
    mxid = 0
    for row in curresult:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    db.execute("""INSERT INTO papers VALUES
                (?,?,?,?,?);""", (mxid, title, link, user_id, abstract))
    return mxid

# 综合检索论文
def dbGetPaperList(db, paper_id=None, paper_name=None, user_id=None):
    exec = """SELECT * FROM papers WHERE true """
    # db.execute("""SELECT * FROM papers WHERE true and true""")
    if paper_id:
        exec += """and (paper_id = %d) """ % (paper_id)
    if paper_name:
        exec += """and  (paper_name = '%s') """ % (paper_name)
    if user_id:
        exec += """and  (user_id = %d) """ % (user_id)
    result = db.execute(exec)

    return [{'paper_id': row[0], 'paper_name':row[1], 'paper_link':row[2], 'user_id':row[3], 'paper_abstract':row[4]} for row in result]

# 更新papers表的paper_name,paper_link
def dbUpdatePaper(db,paper_id,paper_name=None,paper_link=None, paper_abstract=None):
    if paper_name:
        db.execute("""update papers SET  paper_name=? WHERE paper_id = ? ;""",(paper_name,paper_id))
    if paper_link:
        db.execute("""update papers SET  paper_link=? WHERE paper_id = ? ;""",(paper_link,paper_id))
    if paper_abstract:
        db.execute("""update papers SET  paper_abstract=? WHERE paper_id = ?;""",(paper_abstract,paper_id))

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

    if dataset_id:
        exec += """and (dataset_id = %d) """ % (dataset_id)
    if dataset_name:
        exec += """and  (dataset_name = '%s') """ % (dataset_name)
    if user_id:
        exec += """and  (user_id = %d) """ % (user_id)
    result = db.execute(exec)

    return [{'dataset_id': row[0], 'dataset_name':row[1], 'dataset_link':row[2], 'user_id':row[3]} for row in result]

# 更新datasets表的dataset_name,dataset_link
def dbUpdateDataset(db,dataset_id,dataset_name=None,dataset_link=None):
    if dataset_name:
        db.execute("""update datasets SET  dataset_name=? WHERE dataset_id = ? ;""",(dataset_name,dataset_id))
    if dataset_link:
        db.execute("""update datasets SET  dataset_link=? WHERE dataset_id = ? ;""",(dataset_link,dataset_id))

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
    if codeset_id:
        exec+="""and (codeset_id = %d) """%(codeset_id)
    if codeset_name:
        exec+="""and  (codeset_name = '%s') """%(codeset_name)
    if user_id:
        exec+="""and  (user_id = %d) """%(user_id)
    result=db.execute(exec)
    return [{'codeset_id': row[0], 'codeset_name':row[1], 'codeset_link':row[2], 'user_id':row[3]} for row in result]

# 更新codesets表的codeset_name,codeset_link
def dbUpdateCodeset(db,codeset_id,codeset_name=None,codeset_link=None):
    if codeset_name:
        db.execute("""update codesets SET  codeset_name=? WHERE codeset_id = ? ;""",(codeset_name,codeset_id))
    if codeset_link:
        db.execute("""update codesets SET  codeset_link=? WHERE codeset_id = ? ;""",(codeset_link,codeset_id))

# 删除 codeset
def dbDeleteCodeset(db, codeset_id):
    result = db.execute("""DELETE FROM codesets WHERE codeset_id = ?;""", (codeset_id,))
    return result

# -------------------- 结果集相关 result --------------------
# 新增 result
def dbInsertResult(db, result_type, result_name, result_link, paper_id, user_id):
    if (result_type not in ("link", "img", "csv", "other", "bin")):
        return False
    result = db.execute("SELECT result_id FROM results;")
    mxid = 0
    for row in result:
        mxid = max(mxid, row[0])
    mxid = mxid + 1
    # mxid=db.execute("select count(*) from results ")[0][0]+1
    db.execute("""INSERT INTO results VALUES
                    (?,?,?,?,?,?);""", (mxid, result_name, result_link, result_type, paper_id, user_id))
    return mxid

# 综合查询result列表
def dbGetResultList(db, result_id=None, result_name=None, result_type=None,paper_id=None, user_id=None):
    exec="""SELECT * FROM results where true """

    if result_id:
        exec+="""and (result_id = %d) """%(result_id)
    if result_type:
        exec+="""and (result_type = '%s') """%(result_type)
    if result_name:
        exec+="""and (result_name = '%s') """%(result_name)
    if paper_id:
        exec+="""and (paper_id = %d) """%(paper_id)
    if user_id:
        exec+="""and (user_id = %d) """%(user_id)
    ret=db.execute(exec)
    return [{'result_id': row[0], 'result_name':row[1], 'result_link':row[2],'result_type':row[3], 'paper_id':row[4], 'user_id':row[5]} for row in ret]

# 删除 result
def dbDeleteResult(db, result_id):
    result = db.execute("""DELETE FROM results WHERE result_id = ?;""", (result_id,))
    return result

# 更新results表的result_name,result_link
def dbUpdateResult(db,result_id,result_name=None,result_link=None):
    if result_name:
        db.execute("""update results SET  result_name=? WHERE result_id = ? ;""",(result_name,result_id))
    if result_link:
        db.execute("""update results SET  result_link= ? WHERE result_id = ? ;""",(result_link,result_id))


# -------------------- RCD 相关 --------------------
# 新增 RCD 项
def dbInsertRCD(db, result_id, codeset_id,  code_link,dataset_id, data_link,paper_id, user_id):
    result = db.execute("SELECT rcd_id FROM rcds;")
    mxid = 0
    for row in result:
        mxid = max(mxid, row[0])
    mxid = mxid + 1

    db.execute("""INSERT INTO rcds VALUES
                    (?,?,?,?,?,?,?,?);""", (mxid,result_id, codeset_id,code_link,dataset_id, data_link,paper_id, user_id))
    return mxid

# 综合查询RCD列表
def dbGetRCDList(db, rcd_id=None, result_id=None, codeset_id=None,dataset_id=None ,paper_id=None, user_id=None):
    exec = """SELECT * FROM rcds WHERE true """
    if rcd_id:
        exec += """and (rcd_id = %d)"""%(rcd_id)
    if paper_id:
        exec += """and (paper_id = %d)"""%(paper_id)
    if result_id:
        exec += """and (result_id = %d) """%(result_id)
    if dataset_id:
        exec += """and (dataset_id = %d)"""%(dataset_id)
    if codeset_id:
        exec += """and (codeset_id = %d)"""%(codeset_id)
    if user_id:
        exec += """and (user_id = %d)"""%(user_id)
    result = db.execute(exec)

    return [{'rcd_id': row[0], 'result_id': row[1], 'codeset_id':row[2], 'code_link':row[3], 'dataset_id':row[4], 'data_link':row[5],'paper_id':row[6], 'user_id':row[7]} for row in result]

# 删除 RCD
def dbDeleteRCD(db, rcd_id=None, result_id=None, codeset_id=None, dataset_id=None, paper_id=None):
    exec="""DELETE FROM rcds WHERE false """
    if rcd_id:
        exec+=""" or (rcd_id = %d) """%(rcd_id)
    if result_id:
        exec+=""" or (result_id = %d) """%(result_id)
    if codeset_id:
        exec+=""" or (codeset_id = %d) """%(codeset_id)
    if dataset_id:
        exec+=""" or (dataset_id = %d) """%(dataset_id)
    if paper_id:
        exec+=""" or (paper_id = %d) """%(paper_id)
    result = db.execute(exec)
    return result

# 更新 rcd 表
def dbUpdateRCD(db, rcd_id, result_id = None, codeset_id = None,  code_link = None , dataset_id = None, data_link = None, paper_id = None):
    exec = []
    if code_link:
        exec.append("""code_link = '%s'""" % (code_link))
    if data_link:
        exec.append("""data_link = '%s'""" % (data_link))
    if exec != []:
        exec = "UPDATE rcds SET " + ",".join(exec) + " WHERE rcd_id = %d;" % (rcd_id)
        print(exec)
        result = db.execute(exec)
        return result
    return None
import unittest
from dbutils import *
import random

def getrandomstr(len):
    return "".join([random.choice(
                            string.ascii_letters + string.digits
                            + r"~!@#$%^&*()_+|\}]{[?/>.<,") for _ in range(len)])

class DBTest(unittest.TestCase):
    def setUp(self):
        (self.db, self.conn) = dbInit("unittest020729.db")
    def test_table_create_ok(self):
        tablelist = ["papers", "datasets", "results", "rcds", "codesets"]
        result = self.db.execute("""SELECT name FROM SQLITE_MASTER
                                WHERE type='table';""")
        tablename = [row[0] for row in result]
        for table in tablelist:
            self.assertIn(table, tablename)
    def test_empty_query_by_id(self):
        testpapersize = 50
        testdatas = []
        idlist = []
        for _ in range(0, testpapersize):
            data = (getrandomstr(50), getrandomstr(50), getrandomstr(50))
            testdatas.append(data)
            idlist.append(dbInsertPaper(self.db, data[0], data[1], random.randint(0, 10), getrandomstr(50)))
        mxid = max(idlist) + 622
        result = dbGetPaperList(self.db, user_id=mxid)
        self.assertEqual(result, [])
    def test_insert_paper_and_query_by_id(self):
        testdatas = [{'paper_name' : "paper 1", 'paper_link' : "link 1", 'user_id' : 1},
                    {'paper_name' : "paper 2", 'paper_link' : "link 2", 'user_id' : 2},
                    {'paper_name' : "paper 998244353", 'paper_link' : "link ###???", 'user_id' : 3},
                    {'paper_name' : "paper @@@,.l]{;'", 'paper_link' : "llllinnnk", 'user_id' : 4}]
        idlist = []
        for row in testdatas:
            id = dbInsertPaper(self.db, row['paper_name'], row['paper_link'], row['user_id'], row['paper_abstract'])
            row['paper_id'] = id
            idlist.append(id)
        self.assertEqual(idlist, [1,2,3,4])
        result = dbGetPaperList(self.db, paper_id=1)
        self.assertEqual(result, [testdatas[0]])
        result = dbGetPaperList(self.db, paper_id=4)
        self.assertEqual(result, [testdatas[3]])
    def test_insert_paper_and_query_by_title(self):
        testdatas = [{'paper_name':"Retrospective on the 2021 BASALT Competition on Learning from Human Feedback", 'paper_link':"https://arxiv.org/abs/2204.07123", 'user_id':"1"},
                    {'paper_name':"Exact and approximate determination of the Pareto set using minimal correction subsets", 'paper_link':"https://arxiv.org/abs/2204.06908", 'user_id':"2"}]
        for testdata in testdatas:
            id = dbInsertPaper(self.db, testdata['paper_name'], testdata['paper_link'], testdata['user_id'], testdata['paper_abstract'])
            testdata['paper_id'] = id
        result = dbGetPaperList(self.db, paper_name= "Retrospective on the 2021 BASALT Competition on Learning from Human Feedback")
        self.assertEqual(result, [result[0]])
        result = dbGetPaperList(self.db, paper_name="CSAPP")
        self.assertEqual(result, [])
    def test_query_by_user_id(self):
        user_idnumber = 50
        users = []
        for _ in range(0, user_idnumber):
            user_id = _ + 1
            user_papernum = random.randint(10, 30)
            user_papers = []
            for __ in range(0, user_papernum):
                papertitle = getrandomstr(100)
                paperlink = getrandomstr(100)
                paperabstract = getrandomstr(100)
                id = dbInsertPaper(self.db, papertitle, paperlink, user_id, paperabstract)
                user_papers.append({'paper_id' : id, 'paper_name': papertitle, "paper_link":paperlink, "user_id":user_id})
            users.append((user_id, user_papers))
        for user in users:
            user_id = user[0]
            result = dbGetPaperList(self.db, user_id=user_id)
            self.assertEqual(result, user[1])
    def test_insert_dataset(self):
        testdatas = [{'dataset_name':"ImageNet", 'dataset_link':"https://image-net.org/download.php", 'user_id':'sycstudio'},
                    {'dataset_name':"ECDIT", 'dataset_link':"https://github.com/SYCstudio/ECDICT", 'user_id':'sycstudio'},
                    {'dataset_name':"ChinesXinhua", 'dataset_link':"https://github.com/SYCstudio/chinese-xinhua", 'user_id':'sycstudio'},
                    {'dataset_name':"name", 'dataset_link':'link', 'user_id':'user_id'}]
        idlist = []
        for dataset in testdatas:
            id = dbInsertDataset(self.db, dataset['dataset_name'], dataset['dataset_link'], dataset['user_id'])
            dataset['dataset_id'] = id
            idlist.append(id)
        self.assertEqual(idlist, [1,2,3,4])
        result = dbGetDatasetList(self.db, dataset_id=2)
        self.assertEqual(result, [testdatas[1]])
        result = dbGetDatasetList(self.db, dataset_name="ImageNet")
        self.assertEqual(result, [testdatas[0]])
        result = dbGetDatasetList(self.db, dataset_name="KerubielMayuri")
        self.assertEqual(result, [])
        result = dbGetDatasetList(self.db, dataset_name="name")
        self.assertEqual(result, [testdatas[3]])
    def test_results(self):
        testdatas = [{'result_name':'name1','result_type':"link", 'result_link':"https://arxiv.org/pdf/2204.07123.pdf#page=5", 'paper_id':1},
                    {'result_name':'name2', 'result_type':"link", 'result_link':"https://arxiv.org/pdf/2204.06908.pdf#page=9",'paper_id':1},
                    {'result_name':'name3', 'result_type':"img", 'result_link':"https://sycstudio.com/gravatar.png",'paper_id':2},
                    {'result_name':'name4', 'result_type':"csv", 'result_link':"https://github.com/SYCstudio/ECDICT/blob/master/ecdict.mini.csv",'paper_id':3}]
        result = dbInsertResult(self.db, "pdf", "nae", "https://github.com/SYCstudio/Summary/blob/master/summary.pdf", 1, 1)
        self.assertFalse(result)
        idlist = []
        for data in testdatas:
            result_id = dbInsertResult(self.db, data['result_type'], data['result_name'], data['result_link'], data['paper_id'], 1)
            self.assertNotEqual(False, result_id)
            idlist.append(result_id)
            data['result_id'] = result_id
        self.assertEqual(idlist, [1,2,3,4])
        result = dbGetResultList(self.db, result_id=1)
        self.assertEqual(result, [testdatas[0]])
        result = dbGetResultList(self.db, result_id=3)
        self.assertEqual(result, [testdatas[2]])
        result = dbGetResultList(self.db, result_id=20020415)
        self.assertEqual(result, [])
        result = dbGetResultList(self.db, paper_id=1)
        self.assertEqual(result, [testdatas[0], testdatas[1]])
        result = dbGetResultList(self.db, result_name="name2")
        self.assertEqual(result, [testdatas[1]])
        result = dbGetResultList(self.db, result_type="link")
        self.assertEqual(result, [testdatas[0], testdatas[1]])
        dbDeleteResult(self.db, 1)
        # print(dbGetResultList(self.db))
        result = dbGetResultList(self.db, result_id=1)
        self.assertEqual(result, [])
        result = dbGetResultList(self.db, result_type='csv')
        self.assertEqual(result, [testdatas[3]])
        dbDeleteResult(self.db, 3)
        result = dbGetResultList(self.db, paper_id=2)
        self.assertEqual(result, [])
        result = dbGetResultList(self.db, paper_id = 1)
        self.assertEqual(result, [testdatas[1]])
    def test_rcd(self):
        testdatas = [{'paper_id':1, 'dataset_id':1, 'code_link':'Table1', 'result_id': 1, 'codeset_id':1, 'data_link':'d1'},
        			{'paper_id':2, 'dataset_id':2, 'code_link':'Figure1', 'result_id': 2,'codeset_id':2, 'data_link':'d2'},
                    {'paper_id':1, 'dataset_id':2, 'code_link':'Figure1', 'result_id': 3,'codeset_id':3, 'data_link':'d3'},
                    {'paper_id':1, 'dataset_id':2, 'code_link':'Table2', 'result_id': 4, 'codeset_id':4, 'data_link':'d4'},
                    {'paper_id':3, 'dataset_id':2, 'code_link':'Table1', 'result_id': 5, 'codeset_id':5, 'data_link':'d5'}]
        for data in testdatas:
            id = dbInsertRCD(self.db, data['result_id'], data['codeset_id'], data['code_link'], data['dataset_id'], data['data_link'], data['paper_id'], 1)
            data['rcd_id'] = id
        result = dbGetRCDList(self.db, paper_id=5)
        self.assertEqual(result, [])
        result = dbGetRCDList(self.db, dataset_id=10)
        self.assertEqual(result, [])
        result = dbGetRCDList(self.db, paper_id=1)
        self.assertEqual(result, [testdatas[0], testdatas[2], testdatas[3]])
        result = dbGetRCDList(self.db, paper_id=2)
        self.assertEqual(result, [testdatas[1]])
        result = dbGetRCDList(self.db, dataset_id=1)
        self.assertEqual(result, [testdatas[0]])
        result = dbGetRCDList(self.db, dataset_id=2)
        self.assertEqual(result, testdatas[1:])
        result = dbGetRCDList(self.db, paper_id=1, dataset_id=2)
        self.assertEqual(result,testdatas[2:4])
        result = dbGetRCDList(self.db, paper_id=1, codeset_id=1)
        self.assertEqual(result, [testdatas[0]])
        result = dbGetRCDList(self.db, paper_id=1, codeset_id=8)
        self.assertEqual(result, [])
        result = dbGetRCDList(self.db, paper_id=1, codeset_id=4)
        self.assertEqual(result, [testdatas[3]])
        result = dbGetRCDList(self.db, dataset_id=10)
        self.assertEqual(result, [])
        dbDeleteRCD(self.db, paper_id = 1)
        result = dbGetRCDList(self.db, dataset_id=2)
        self.assertEqual(result, [testdatas[1], testdatas[4]])
        result = dbGetRCDList(self.db, rcd_id=1)
        self.assertEqual(result, [])
        result = dbGetRCDList(self.db, result_id=4)
        self.assertEqual(result, [])
        result = dbGetRCDList(self.db, result_id = 5)
        self.assertEqual(result, [testdatas[4]])
    def test_delete_paper(self):
        testdatas = [{'paper_name' : "paper 1", 'paper_link' : "link 1", 'user_id' : 1},
                    {'paper_name' : "paper 2", 'paper_link' : "link 2", 'user_id' : 2},
                    {'paper_name' : "paper 998244353", 'paper_link' : "link ###???", 'user_id' : 3},
                    {'paper_name' : "paper @@@,.l]{;'", 'paper_link' : "llllinnnk", 'user_id' : 4}]
        # idlist = []
        id1 = dbInsertPaper(self.db, testdatas[0]['paper_name'], testdatas[0]['paper_link'], testdatas[0]['user_id'], 'a')
        id2 = dbInsertPaper(self.db, testdatas[1]['paper_name'], testdatas[1]['paper_link'], testdatas[1]['user_id'], 'a')
        testdatas[0]['paper_id'] = id1
        testdatas[1]['paper_id'] = id2
        self.assertEqual(id1, 1)
        self.assertEqual(id2, 2)
        result = dbGetPaperList(self.db, paper_id=1)
        self.assertEqual(result, [testdatas[0]])
        dbDeletePaper(self.db, 1)
        result = dbGetPaperList(self.db, paper_id=1)
        self.assertEqual(result, [])
        result = dbGetPaperList(self.db, paper_id=2)
        self.assertEqual(result, [testdatas[1]])
        id3 = dbInsertPaper(self.db, testdatas[2]['paper_name'], testdatas[2]['paper_link'], testdatas[2]['user_id'], 'a')
        testdatas[2]['paper_id'] = id3
        self.assertEqual(id3, 3)
        result = dbGetPaperList(self.db, paper_id=1)
        self.assertEqual(result, [])
        result = dbGetPaperList(self.db, paper_name='paper 998244353')
        self.assertEqual(result, [testdatas[2]])
    def test_delete_dataset(self):
        testdatas = [{'dataset_name':"ImageNet", 'dataset_link':"https://image-net.org/download.php", 'user_id':'sycstudio'},
                    {'dataset_name':"ECDIT", 'dataset_link':"https://github.com/SYCstudio/ECDICT", 'user_id':'sycstudio'},
                    {'dataset_name':"ChinesXinhua", 'dataset_link':"https://github.com/SYCstudio/chinese-xinhua", 'user_id':'sycstudio'},
                    {'dataset_name':"name", 'dataset_link':'link', 'user_id':'user_id'}]
        id1 = dbInsertDataset(self.db, testdatas[0]['dataset_name'], testdatas[0]['dataset_link'], testdatas[0]['user_id'])
        id2 = dbInsertDataset(self.db, testdatas[1]['dataset_name'], testdatas[1]['dataset_link'], testdatas[1]['user_id'])
        testdatas[0]['dataset_id'] = id1
        testdatas[1]['dataset_id'] = id2
        self.assertEqual(id1, 1)
        self.assertEqual(id2, 2)
        result = dbGetDatasetList(self.db, dataset_id = 1)
        self.assertEqual(result, [testdatas[0]])
        dbDeleteDataset(self.db, 1)
        result = dbGetDatasetList(self.db, dataset_id = 1)
        self.assertEqual(result, [])
        result = dbGetDatasetList(self.db, dataset_id = 2)
        self.assertEqual(result, [testdatas[1]])
        id3 = dbInsertDataset(self.db, testdatas[2]['dataset_name'], testdatas[2]['dataset_link'], testdatas[2]['user_id'])
        testdatas[2]['dataset_id'] = id3
        self.assertEqual(id3, 3)
        result = dbGetDatasetList(self.db, dataset_id = 1)
        self.assertEqual(result, [])
        result = dbGetDatasetList(self.db, dataset_id = 3)
        self.assertEqual(result, [testdatas[2]])
    def test_codeset(self):
        testdatas = [{'codeset_name':"OI", 'codeset_link':"https://github.com/SYCstudio/OI", 'user_id':1},
                    {'codeset_name':'dress', 'codeset_link':"https://github.com/komeiji-satori/Dress", 'user_id':2},
                    {'codeset_name':'notebook', 'codeset_link':"https://github.com/SYCstudio/notebook", 'user_id':1},
                    {'codeset_name':'QWordWindow', 'codeset_link':'https://github.com/SYCstudio/QWordWindow', 'user_id':1},
                    {'codeset_name':'heti', 'codeset_link':"https://github.com/sivan/heti", 'user_id':3}]
        idlist = []
        for data in testdatas:
            codeset_id = dbInsertCodeset(self.db, data['codeset_name'], data['codeset_link'], data['user_id'])
            data['codeset_id'] = codeset_id
            idlist.append(codeset_id)
        self.assertEqual(idlist, [1,2,3,4,5])
        result = dbGetCodesetList(self.db, codeset_id=1)
        self.assertEqual(result, [testdatas[0]])
        result = dbGetCodesetList(self.db, codeset_id=5)
        self.assertEqual(result, [testdatas[4]])
        result = dbGetCodesetList(self.db, user_id=1)
        self.assertEqual(result, [testdatas[0], testdatas[2], testdatas[3]])
        result = dbGetCodesetList(self.db, user_id=3)
        self.assertEqual(result, [testdatas[4]])
        result = dbGetCodesetList(self.db, user_id=4)
        self.assertEqual(result, [])
        result = dbGetCodesetList(self.db, codeset_name='dress')
        self.assertEqual(result, [testdatas[1]])
        result = dbGetCodesetList(self.db, codeset_name='noteboook')
        self.assertEqual(result, [])
        result = dbGetCodesetList(self.db, codeset_name='OI', user_id=1)
        self.assertEqual(result, [testdatas[0]])
        result = dbGetCodesetList(self.db, codeset_name='heti', user_id=1)
        self.assertEqual(result, [])
        dbDeleteCodeset(self.db, 1)
        result = dbGetCodesetList(self.db, codeset_name="OI")
        self.assertEqual(result, [])
        result = dbGetCodesetList(self.db, user_id=1)
        self.assertEqual(result, [testdatas[2], testdatas[3]])
    def test_rcd_update(self):
        testdatas = [{'paper_id':1, 'dataset_id':1, 'code_link':'Table1', 'result_id': 1, 'codeset_id':1, 'data_link':'d1'},
        			{'paper_id':2, 'dataset_id':2, 'code_link':'Figure1', 'result_id': 2,'codeset_id':2, 'data_link':'d2'},
                    {'paper_id':1, 'dataset_id':2, 'code_link':'Figure1', 'result_id': 3,'codeset_id':3, 'data_link':'d3'},
                    {'paper_id':1, 'dataset_id':2, 'code_link':'Table2', 'result_id': 4, 'codeset_id':4, 'data_link':'d4'},
                    {'paper_id':3, 'dataset_id':2, 'code_link':'Table1', 'result_id': 5, 'codeset_id':5, 'data_link':'d5'}]
        for data in testdatas:
            rcd_id = dbInsertRCD(self.db, data['result_id'], data['codeset_id'], data['code_link'], data['dataset_id'], data['data_link'], data['paper_id'], 'a')
            data['rcd_id'] = rcd_id
        result = dbGetRCDList(self.db, rcd_id=4)
        self.assertEqual(result, [testdatas[3]])
        testdatas[3]['dataset_id'] = 7
        dbUpdateRCD(self.db, 4, dataset_id= 7)
        result = dbGetRCDList(self.db, rcd_id=4)
        self.assertEqual(result, [testdatas[3]])
        result = dbGetRCDList(self.db, dataset_id=2)
        self.assertEqual(result, [testdatas[1], testdatas[2], testdatas[4]])
        testdatas[0]['paper_id'] = 10
        testdatas[0]['dataset_id'] = 9
        testdatas[0]['result_id'] = 11
        dbUpdateRCD(self.db, 1, paper_id = 10, dataset_id = 9, result_id = 11)
        result = dbGetRCDList(self.db, rcd_id=1)
        self.assertEqual(result, [testdatas[0]])
    def tearDown(self):
        self.conn.close()
        dbClear('unittest020729.db')

if __name__ == '__main__':
    unittest.main()
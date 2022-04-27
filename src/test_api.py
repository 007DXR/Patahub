from fastapi.testclient import TestClient
from api import app


def test_read_root():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"Title": "Patahub"}


def test_post_paper():
    with TestClient(app) as client:
        # success
        response = client.post(
            "/paper",
            json={
                "user_id": 3,
                "paper_name": "p4",
                "paper_link": "pl4"
            }
        )
        assert response.status_code == 200
        assert response.json() == {
            "user_id": 3,
            "paper_name": "p4",
            "paper_link": "pl4",
            "paper_id": 4
        }
        response = client.post(
            "/paper",
            json={
                "user_id": 2,
                "paper_id": 3,
                "paper_name": "pp3",
                "paper_link": "ppl3"
            }
        )
        assert response.status_code == 200
        # fail
        response = client.post(
            "/paper",
            json={
                "user_id": 3,
                "paper_name": "p4"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/paper",
            json={
                "user_id": 3,
                "paper_link": "pl4"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/paper",
            json={
                "user_id": "abaaba",
                "paper_name": "p4",
                "paper_link": "pl4"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/paper",
            json={
                "user_id": 2,
                "paper_id": "fake",
                "paper_name": "pp2"
            }
        )
        assert response.status_code == 422


def test_post_dataset():
    with TestClient(app) as client:
        # success
        response = client.post(
            "/dataset",
            json={
                "user_id": 3,
                "dataset_name": "d5",
                "dataset_link": "dl5"
            }
        )
        assert response.status_code == 200
        assert response.json() == {
            "user_id": 3,
            "dataset_name": "d5",
            "dataset_link": "dl5",
            "dataset_id": 5
        }
        response = client.post(
            "/dataset",
            json={
                "user_id": 2,
                "dataset_id": 3,
                "dataset_name": "dd3",
                "dataset_link": "ddl3"
            }
        )
        assert response.status_code == 200
        # fail
        response = client.post(
            "/dataset",
            json={
                "dataset_name": "d1",
                "user_id": 1
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/dataset",
            json={
                "dataset_link": "dl1",
                "user_id": 1
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/dataset",
            json={
                "dataset_name": "d1",
                "dataset_link": "dl1",
                "user_id": "tzj"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/dataset",
            json={
                "user_id": 2,
                "dataset_id": "fake",
                "dataset_name": "d2"
            }
        )
        assert response.status_code == 422

def test_post_code():
    with TestClient(app) as client:
        # success
        response = client.post(
            "/codeset",
            json={
                "codeset_name": "c3",
                "codeset_link": "cl3",
                "user_id": 3
            }
        )
        assert response.status_code == 200
        assert response.json() == {
            "codeset_name": "c3",
            "codeset_link": "cl3",
            "user_id": 3,
            "codeset_id": 3
        }
        response = client.post(
            "/codeset",
            json={
                "user_id": 2,
                "codeset_id": 2,
                "codeset_name": "pp3",
                "codeset_link": "ppl3"
            }
        )
        assert response.status_code == 200
        # fail
        response = client.post(
            "/codeset",
            json={
                "codeet_name": "c1",
                "user_id": 1
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/codeset",
            json={
                "codeset_link": "cl1",
                "user_id": 1
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/codeset",
            json={
                "codeset_name": "c1",
                "codeset_link": "cl1",
                "user_id": "tzj"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/codeset",
            json={
                "user_id": 2,
                "codeset_id": "fake",
                "codeset_name": "pp2"
            }
        )
        assert response.status_code == 422


def test_post_result():
    with TestClient(app) as client:
        # success
        response = client.post(
            "/result",
            json={
                "result_type": "link",
                "result_name": "r4",
                "result_link": "rl4",
                "paper_id": 2
            }
        )
        assert response.status_code == 200
        assert response.json() == {
            "result_type": "link",
            "result_name": "r4",
            "result_link": "rl4",
            "paper_id": 2,
            "result_id": 4
        }
        # fail
        response = client.post(
            "/result",
            json={
                "result_type": "fake type",
                "result_name": "r1",
                "result_link": "l1",
                "paper_id": 2
            }
        )
        assert response.status_code == 400
        assert response.json() == {
            "detail": "invalid type"
        }
        response = client.post(
            "/result",
            json={
                "result_type": "csv",
                "result_name": 1234,
                "result_link": "l1"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/result",
            json={
                "result_type": "img",
                "result_name": "r1"
            }
        )
        assert response.status_code == 422
        response = client.post(
            "/result",
            json={
                "user_id": 2,
                "result_id": "fake",
                "result_name": "pp2"
            }
        )
        assert response.status_code == 422
        
def test_post_rcd():
    with TestClient(app) as client:
        # success
        response = client.post(
            "/rcd",
            json={
                "paper_id": 1,
                "result_id": 1,
                "dataset_id": 1,
                "codeset_id": 1,
                "data_link": "ddl1",
                "code_link": "ccl1"
            }
        )
        assert response.json() == {
            "paper_id": 1,
            "result_id": 1,
            "dataset_id": 1,
            "codeset_id": 1,
            "data_link": "ddl1",
            "code_link": "ccl1",
            "rcd_id": 4
        }
        assert response.status_code == 200
        response = client.post(
            "/rcd",
            json={
                "rcd_id": 1,
                "paper_id": 1,
                "result_id": 1,
                "dataset_id": 1,
                "codeset_id": 1,
                "data_link": "ddl1",
                "code_link": "ccl1"
            }
        )
        assert response.status_code == 200
        # fail paper
        response = client.post(
            "/rcd",
            json={
                "paper_id": 100000,
                "result_id": 1,
                "dataset_id": 1,
                "codeset_id": 1,
                "data_link": "dl1",
                "code_link": "cl1"
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "paper id invalid"
        }
        # fail dataset
        response = client.post(
            "/rcd",
            json={
                "paper_id": 1,
                "result_id": 1,
                "dataset_id": 100000,
                "codeset_id": 1,
                "data_link": "dl1",
                "code_link": "cl1"
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "dataset id invalid"
        }
        # fail result
        response = client.post(
            "/rcd",
            json={
                "paper_id": 1,
                "result_id": 100000,
                "dataset_id": 1,
                "codeset_id": 1,
                "data_link": "dl1",
                "code_link": "cl1"
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "result id invalid"
        }
        # fail code
        response = client.post(
            "/rcd",
            json={
                "paper_id": 1,
                "result_id": 1,
                "dataset_id": 1,
                "codeset_id": 100000,
                "data_link": "dl1",
                "code_link": "cl1"
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "code id invalid"
        }
        # fail link
        # response = client.post(
        #     "/rcd",
        #     json={
        #         "paper_id": 1,
        #         "result_id": 1,
        #         "dataset_id": 1,
        #         "codeset_id": 1,
        #         "data_link": "dl1",
        #         "code_link": 2333
        #     }
        # )
        # assert response.status_code == 422


def test_get_paper_list():
    with TestClient(app) as client:
        # success
        response = client.get(
            "/paper",
            params={
                "paper_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "user_id": 1,
                "paper_name": "p1",
                "paper_link": "pl1",
                "paper_id": 1
            }
        ]
        response = client.get(
            "/paper",
            params={
                "user_id": 1,
                "paper_name": "p2"
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "user_id": 1,
                "paper_name": "p2",
                "paper_link": "pl2",
                "paper_id": 2
            }
        ]
        # fail
        response = client.get(
            "/paper",
            params={
                "paper_id": 100000
            }
        )
        assert response.json() == []
        response = client.get(
            "/paper",
            params={
                "paper_name": "ppppppp"
            }
        )
        assert response.json() == []
        # conflict
        response = client.get(
            "/paper",
            params={
                "paper_id": 1,
                "user_id": 2
            }
        )
        assert response.json() == []

def test_get_dataset_list():
    with TestClient(app) as client:
        # success
        response = client.get(
            "/dataset",
            params={
                "dataset_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "user_id": 1,
                "dataset_name": "d1",
                "dataset_link": "dl1",
                "dataset_id": 1
            }
        ]
        response = client.get(
            "/dataset",
            params={
                "user_id": 2,
                "dataset_name": "d3"
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "user_id": 2,
                "dataset_name": "d3",
                "dataset_link": "dl3",
                "dataset_id": 3
            }
        ]
        # fail
        response = client.get(
            "/dataset",
            params={
                "dataset_id": 100000
            }
        )
        assert response.json() == []
        response = client.get(
            "/dataset",
            params={
                "dataset_name": "ppppppp"
            }
        )
        assert response.json() == []
        # conflict
        response = client.get(
            "/dataset",
            params={
                "dataset_id": 1,
                "user_id": 2
            }
        )
        assert response.json() == []

def test_get_code_list():
    with TestClient(app) as client:
        # success
        response = client.get(
            "/codeset",
            params={
                "codeset_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "user_id": 1,
                "codeset_name": "c1",
                "codeset_link": "cl1",
                "codeset_id": 1
            }
        ]
        response = client.get(
            "/codeset",
            params={
                "user_id": 2,
                "codeset_name": "c2"
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "user_id": 2,
                "codeset_name": "c2",
                "codeset_link": "cl2",
                "codeset_id": 2
            }
        ]
        # fail
        response = client.get(
            "/codeset",
            params={
                "codeset_id": 100000
            }
        )
        assert response.json() == []
        response = client.get(
            "/codeset",
            params={
                "codeset_name": "ppppppp"
            }
        )
        assert response.json() == []
        # conflict
        response = client.get(
            "/codeset",
            params={
                "codeset_id": 1,
                "user_id": 2
            }
        )
        assert response.json() == []

def test_get_result_list():
    with TestClient(app) as client:
        # success
        response = client.get(
            "/result",
            params={
                "result_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "result_name": "r1",
                "result_link": "rl1",
                "result_type": "csv",
                "paper_id": 1,
                "result_id": 1
            }
        ]
        response = client.get(
            "/result",
            params={
                "result_type": "img",
                "paper_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "result_name": "r2",
                "result_link": "rl2",
                "result_type": "img",
                "paper_id": 1,
                "result_id": 2
            }
        ]
        # fail
        response = client.get(
            "/result",
            params={
                "result_id": 100000
            }
        )
        assert response.json() == []
        response = client.get(
            "/result",
            params={
                "result_name": "ppppppp"
            }
        )
        assert response.json() == []
        # conflict
        response = client.get(
            "/result",
            params={
                "result_type": "img",
                "result_name": "r3"
            }
        )
        assert response.json() == []

def test_get_rcd_list():
    with TestClient(app) as client:
        # success
        response = client.get(
            "/rcd",
            params={
                "rcd_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "rcd_id": 1,
                "result_id": 1,
                "codeset_id": 1,
                "code_link": "cl1",
                "dataset_id": 1,
                "data_link": "dl1",
                "paper_id": 1
            }
        ]
        response = client.get(
            "/rcd",
            params={
                "codeset_id": 1,
                "paper_id": 1
            }
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "rcd_id": 1,
                "result_id": 1,
                "codeset_id": 1,
                "code_link": "cl1",
                "dataset_id": 1,
                "data_link": "dl1",
                "paper_id": 1
            },
            {
                "rcd_id": 2,
                "result_id": 2,
                "codeset_id": 1,
                "code_link": "cl1",
                "dataset_id": 2,
                "data_link": "dl2",
                "paper_id": 1
            }
        ]
        # fail
        response = client.get(
            "/rcd",
            params={
                "rcd_id": 100000
            }
        )
        assert response.json() == []
        # conflict
        response = client.get(
            "/rcd",
            params={
                "dataset_id": 1,
                "result_id": 2
            }
        )
        assert response.json() == []

def test_delete_paper():
    with TestClient(app) as client:
        # success
        response = client.delete(
            "/paper",
            params={
                "paper_id": 2
            }
        )
        assert response.status_code == 200
        assert response.json() == 2
        # fail
        response = client.delete(
            "/paper",
            params={
                "paper_id": 10000
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "paper id not found"
        }

def test_delete_dataset():
    with TestClient(app) as client:
        # success
        response = client.delete(
            "/dataset",
            params={
                "dataset_id": 2
            }
        )
        assert response.status_code == 200
        assert response.json() == 2
        # fail
        response = client.delete(
            "/dataset",
            params={
                "dataset_id": 10000
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "dataset id not found"
        }

def test_delete_code():
    with TestClient(app) as client:
        # success
        response = client.delete(
            "/codeset",
            params={
                "codeset_id": 2
            }
        )
        assert response.status_code == 200
        assert response.json() == 2
        # fail
        response = client.delete(
            "/codeset",
            params={
                "codeset_id": 10000
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "code id not found"
        }

def test_delete_result():
    with TestClient(app) as client:
        # success
        response = client.delete(
            "/result",
            params={
                "result_id": 2
            }
        )
        assert response.status_code == 200
        assert response.json() == 2
        # fail
        response = client.delete(
            "/result",
            params={
                "result_id": 10000
            }
        )
        assert response.status_code == 404
        assert response.json() == {
            "detail": "result id not found"
        }

def test_delete_rcd():
    with TestClient(app) as client:
        response = client.delete(
            "/rcd",
            params={
                "rcd_id": 2
            }
        )
        assert response.status_code == 200
        response = client.delete(
            "/rcd",
            params={
                "result_id": 2,
                "codeset_id": 3,
                "dataset_id": 1,
                "paper_id": 2
            }
        )
        assert response.status_code == 200

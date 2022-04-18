import React from 'react';
import { getAllRepositories } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'
import CreateRepo from './CreateRepo.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function DeleteRepoAlert(props) {
    return (
        <Modal show={props.status > 0} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>{'删除仓库' + (props.status == 1 ? '成功' : "失败")}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function AllRepositories() {
    const [repoList, setRepoList] = useState([]);
    const [showDeleteRepoAlert, setShowDeleteRepoAlert] = useState(0)
    useEffect(() => {
        getAllRepositories().then((data, err) => {
            setRepoList(data);
            console.log(data);
        });
    }, []);
    return (
        <div>
            {repoList.map((repoName) => <RepoOverView repoName={repoName} onDelete={(status) => setShowDeleteRepoAlert(status)} />)}
            <CreateRepo />
            <DeleteRepoAlert status={showDeleteRepoAlert} onHide={() => setShowDeleteRepoAlert(0)} />
        </div>
    );
}

export default AllRepositories;

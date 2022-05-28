import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import DeleteRepo from '../../Data/DeleteRepo.js'
import { GoTrashcan } from 'react-icons/go';
import { UserInfo } from '../Utilities/auth.js';

function DeleteRepoAlert(props) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>删除仓库失败</Modal.Body>
            <Modal.Footer>
                <Button variant="primary " onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function DeleteRepoButton(props) {
    const [deleteRepoFailure, setDeleteRepoFailure] = useState(false)
    return (
        <React.Fragment>
            <Button variant="primary align-self-center" onClick={async function () {
                const success = await DeleteRepo(UserInfo.token, props.paper_id)
                if (success) window.location.replace('/')
                else setDeleteRepoFailure(true)
            }}
                className="bg-danger border-danger ms-2">
                Delete This Repository
            </Button>
            <DeleteRepoAlert show={deleteRepoFailure} onHide={() => setDeleteRepoFailure(false)} />
        </React.Fragment>
    )
}

export default DeleteRepoButton;
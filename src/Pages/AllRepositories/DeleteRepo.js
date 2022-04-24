import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import DeleteRepo from '../../Data/DeleteRepo.js'
import { GoTrashcan } from 'react-icons/go';

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
            <Button variant="primary h-50 align-self-center" onClick={function () {
                const success = DeleteRepo(props.paperId)
                if (success) window.location.reload()
                else setDeleteRepoFailure(true)
            }}
                className="bg-transparent border-0 btm-sm ms-2 p-1">
                <GoTrashcan color='red' />
            </Button>
            <DeleteRepoAlert show={deleteRepoFailure} onHide={() => setDeleteRepoFailure(false)} />
        </React.Fragment>
    )
}

export default DeleteRepoButton;
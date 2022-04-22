import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import { GoTrashcan } from 'react-icons/go';
import $ from 'jquery'

function DeleteRepo(paperId) {
    let success = false
    const data = JSON.stringify({
        paper_id: paperId
    })
    $.ajax({
        type: "delete",
        url: "api/paper",
        data: data,
        contentType: "application/json",
        async: false,
        success: () => success = true
    });
    return success
}

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
    const [isDeleting, setIsDeleting] = useState(false)
    return (
        <React.Fragment>
            <Spinner className={isDeleting ? "visible" : "invisible"} animation="border" />
            <Button variant="primary align-self-center" onClick={function () {
                setIsDeleting(true)
                const success = DeleteRepo(props.paperId)
                setIsDeleting(false)
                if (success) window.location.reload()
                else setDeleteRepoFailure(true)
            }}
                className={`btn-danger btm-sm ms-2 ${isDeleting ? "invisible" : "visible"}`}>
                <GoTrashcan />
            </Button>
            <DeleteRepoAlert show={deleteRepoFailure} onHide={() => setDeleteRepoFailure(false)} />
        </React.Fragment>
    )
}

export default DeleteRepoButton;
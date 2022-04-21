import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { getRepositoryInfo } from '../../Data/demo.js'
import $ from 'jquery'
const sleep = ms => new Promise(r => setTimeout(r, ms));

function CreateRepoAlert(props) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>创建仓库失败</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function CreateRepoComponent() {
    const [isCreating, setIsCreating] = useState(false)
    return (
        <div>
            <CreateRepoButton onClick={() => setIsCreating(true)} />
            <CreateRepoForm isVisible={isCreating} onHide={() => setIsCreating(false)} />
        </div>
    )
}

function CreateRepoButton(props) {
    return (
        <Button variant="primary" onClick={props.onClick}>Create Repository</Button>
    )
}

async function CreateRepo(paperName, paperLink) {
    const res = await $.post(`http://sycstudio.com:20729/test/${paperName}`, {
        "user": "test",
        "title": paperName,
        "link": paperLink
    }).promise();
    return res;
}

function CreateRepoForm(props) {
    const [paperName, setPaperName] = useState(""),
        onPaperNameInput = ({ target: { value } }) => setPaperName(value)
    const [paperLink, setPaperLink] = useState(""),
        onPaperLinkInput = ({ target: { value } }) => setPaperLink(value)
    const [paperAbstract, setPaperAbstract] = useState(""),
        onPaperAbstractInput = ({ target: { value } }) => setPaperAbstract(value)
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) event.stopPropagation();
        else {
            const res = CreateRepo(paperName, paperLink)
            console.log(res)
            //const res = CreateRepo()
            //if (res) props.showCreateRepoAlert()
            //const repo = getRepositoryInfo(paperName)
            //window.open('/repositoryInfo/' + repo.repoName, '_self')
        }
    };
    if (props.isVisible)
        return (
            <Modal show={props.isVisible} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>填写论文信息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="formPaperInfo" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formPaperName">
                            <Form.Label>Paper Name</Form.Label>
                            <Form.Control type="text" placeholder="Paper Name" onChange={onPaperNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPaperLink">
                            <Form.Label>Paper Link</Form.Label>
                            <Form.Control type="text" placeholder="Paper Link" onChange={onPaperLinkInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid link.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPaperAbstract">
                            <Form.Label>Paper Abstract</Form.Label>
                            <Form.Control as="textarea" placeholder="Paper Abstract" onChange={onPaperAbstractInput} required />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Create
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    else return (
        <div />
    );
}

export default CreateRepoComponent;
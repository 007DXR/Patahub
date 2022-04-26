import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import CreateRepo from '../../Data/CreateRepo.js'

function CreateRepoFailureAlert(props) {
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
    const [isCreating, setIsCreating] = useState(false);
    return (
        <React.Fragment>
            <Button onClick={() => setIsCreating(true)} className="ms-1">Create Repository</Button>
            <CreateRepoForm show={isCreating} onHide={() => setIsCreating(false)} />
        </React.Fragment>
    )
}

function CreateRepoForm(props) {
    const [paperName, setPaperName] = useState(""),
        onPaperNameInput = ({ target: { value } }) => setPaperName(value)
    const [paperLink, setPaperLink] = useState(""),
        onPaperLinkInput = ({ target: { value } }) => setPaperLink(value)
    const [paperAbstract, setPaperAbstract] = useState(""),
        onPaperAbstractInput = ({ target: { value } }) => setPaperAbstract(value)
    const [createRepoFailure, setCreateRepoFailure] = useState(false)
    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) event.stopPropagation();
        else {
            const res = CreateRepo(paperName, paperLink, paperAbstract)
            if (res) {
                window.open('/repositoryInfo/' + res.paper_id, '_self')
            }
            else {
                setCreateRepoFailure(true)
            }
        }
    };
    return (
        <React.Fragment>
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>填写论文信息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="formPaperInfo" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formPaperName">
                            <Form.Label>Paper Name</Form.Label>
                            <Form.Control type="text" placeholder="Paper Name" maxlength="200" onChange={onPaperNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPaperLink">
                            <Form.Label>Paper Link</Form.Label>
                            <Form.Control type="text" placeholder="Paper Link" maxlength="200" onChange={onPaperLinkInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid link.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPaperAbstract">
                            <Form.Label>Paper Abstract</Form.Label>
                            <Form.Control as="textarea" placeholder="Paper Abstract" maxlength="1000" onChange={onPaperAbstractInput} required />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Create
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <CreateRepoFailureAlert show={createRepoFailure} onHide={() => setCreateRepoFailure(false)} />
        </React.Fragment>
    )
}

export default CreateRepoComponent;
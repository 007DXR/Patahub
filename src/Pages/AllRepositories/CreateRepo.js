import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import CreateRepo from '../../Data/CreateRepo.js'
import { GoPlus } from 'react-icons/go';
import { Row, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'

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

export function CreateRepoButton() {
    return (
        <Button onClick={() => window.location.replace(`/createRepo/`)}>
            <GoPlus />
        </Button>
    )
}


export function CreateRepoForm(props) {
    const [validated, setValidated] = useState(false)
    const [paperName, setPaperName] = useState(""),
        onPaperNameInput = ({ target: { value } }) => setPaperName(value);
    const [paperLink, setPaperLink] = useState(""),
        onPaperLinkInput = ({ target: { value } }) => setPaperLink(value);
    const [paperAbstract, setPaperAbstract] = useState(""),
        onPaperAbstractInput = ({ target: { value } }) => setPaperAbstract(value);
    const [createRepoFailure, setCreateRepoFailure] = useState(false)
    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) {
            setValidated(true)
            event.stopPropagation();
        }
        else {
            setValidated(false)
            const res = await CreateRepo(paperName, paperLink, paperAbstract)
            if (res) {
                window.location.replace('/repositoryInfo/' + res.paper_id)
            }
            else {
                setCreateRepoFailure(true)
            }
        }
    };
    return (
        <React.Fragment>
            <Form className="w-50 mx-auto pt-5" noValidate validated={validated} id="formPaperInfo" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formPaperName">
                    <Form.Label>Paper Name</Form.Label>
                    <Form.Control type="text" placeholder="Paper Name" maxLength="200" onChange={onPaperNameInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPaperLink">
                    <Form.Label>Paper Link</Form.Label>
                    <Form.Control type="text" placeholder="Paper Link" maxLength="200" onChange={onPaperLinkInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a link.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPaperAbstract">
                    <Form.Label>Paper Abstract</Form.Label>
                    <Form.Control as="textarea" placeholder="Paper Abstract" maxLength="1000" onChange={onPaperAbstractInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please fill in the paper abstract.
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                        Create
                    </Button>
                </div>
            </Form>
            <CreateRepoFailureAlert show={createRepoFailure} onHide={() => setCreateRepoFailure(false)} />
        </React.Fragment>
    )
}
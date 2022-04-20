import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function CreateRepo() {
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

function CreateRepoForm(props) {
    const [paperName, setPaperName] = useState(""),
        onPaperNameInput = ({ target: { value } }) => setPaperName(value)
    const [paperAbstract, setPaperAbstract] = useState(""),
        onPaperAbstractInput = ({ target: { value } }) => setPaperAbstract(value)
    if (props.isVisible)
        return (
            <Modal show={props.isVisible} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>填写论文信息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formPaperName">
                            <Form.Label>Paper Name</Form.Label>
                            <Form.Control type="text" placeholder="Paper Name" onChange={onPaperNameInput} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPaperAbstract">
                            <Form.Label>Paper Abstract</Form.Label>
                            <Form.Control as="textarea" placeholder="Paper Abstract" onChange={onPaperAbstractInput} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { }}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    else return (
        <div />
    );
}

export default CreateRepo;
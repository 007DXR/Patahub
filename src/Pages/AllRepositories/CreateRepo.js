import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function CreateRepo() {
    const [isCreating, setIsCreating] = useState(false)
    return (
        <div>
            <CreateRepoButton type={isCreating} onClick={() => setIsCreating(!isCreating)} />
            <CreateRepoForm isVisible={isCreating} />
        </div>
    )
}

function CreateRepoButton(props) {
    return (
        <button onClick={props.onClick}>{props.type ? 'Cancel' : 'Create Repository'}</button>
    )
}

function CreateRepoForm(props) {
    const [paperName, setPaperName] = useState(""),
        onPaperNameInput = ({ target: { value } }) => setPaperName(value)
    const [paperAbstract, setPaperAbstract] = useState(""),
        onPaperAbstractInput = ({ target: { value } }) => setPaperAbstract(value)
    if (props.isVisible)
        return (
            <Form>
                <Form.Group className="mb-3" controlId="formPaperName">
                    <Form.Label>Paper Name</Form.Label>
                    <Form.Control type="text" placeholder="Paper Name" onChange={onPaperNameInput} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPaperAbstract">
                    <Form.Label>Paper Abstract</Form.Label>
                    <Form.Control as="textarea" placeholder="Paper Abstract" onChange={onPaperAbstractInput} />
                </Form.Group>
                <Button variant="primary" onClick={() => { }}>
                    Create
                </Button>
            </Form>
        )
    else return (
        <div />
    );
}

export default CreateRepo;
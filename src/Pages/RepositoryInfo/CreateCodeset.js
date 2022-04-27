import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateCodeset } from '../../Data/codeset';

function CreateCodesetForm(props) {
    const [validated, setValidated] = useState(false);
    const [CodesetName, setCodesetName] = useState("");
    const [CodesetLink, setCodesetLink] = useState("");
    const onCodesetNameInput = event => { setCodesetName(event.target.value); setValidated(false); }
    const onCodesetLinkInput = event => { setCodesetLink(event.target.value); setValidated(false); }

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) event.stopPropagation();
        else {
            const res = CreateCodeset(CodesetName, CodesetLink);
            if (res) {
                props.onHide();
            }
            else {
                // setCreateRepoFailure(true)
                alert("error");
            }
        }
        setValidated(true)
    };

    return (
        <React.Fragment>
            <Modal show={props.show} onHide={() => { props.onHide(); setValidated(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>新建Codeset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" >
                            <Form.Label>Codeset name</Form.Label>
                            <Form.Control type="text" onChange={onCodesetNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Codeset link</Form.Label>
                            <Form.Control type="text" onChange={onCodesetLinkInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid link.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>

    )
}

export default CreateCodesetForm;
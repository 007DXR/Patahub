import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateCodeset, EditCodeset } from '../../Data/codeset';

function EditCodesetForm(props) {
    const [validated, setValidated] = useState(false);
    const [codesetName, setCodesetName] = useState(props.codesetName);
    const [codesetLink, setCodesetLink] = useState(props.codesetLink);
    const onCodesetNameInput = event => setCodesetName(event.target.value);
    const onCodesetLinkInput = event => setCodesetLink(event.target.value);

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) {
            setValidated(true)
            event.stopPropagation();
        }
        else {
            setValidated(false)
            const res = EditCodeset(props.codesetID, codesetName, codesetLink);
            if (res) {
                props.onHide();
            }
            else {
                // setCreateRepoFailure(true)
                alert("error");
            }
        }
    };

    return (
        <React.Fragment>
            <Modal show={props.show} onHide={() => { props.onHide(); setValidated(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>修改Codeset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" >
                            <Form.Label>Codeset name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={codesetName} onChange={onCodesetNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Codeset link</Form.Label>
                            <Form.Control type="text" maxLength="200" value={codesetLink} onChange={onCodesetLinkInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a link.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>

    )
}

export default EditCodesetForm;
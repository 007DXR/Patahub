import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateCodeset, EditCodeset } from '../../Data/codeset';

function EditCodesetForm(props) {
    console.log("codeset",props.codeset);
    const [validated, setValidated] = useState(false);
    const [codesetName, setCodesetName] = useState(props.codeset.codeset_name);
    const [codesetLink, setCodesetLink] = useState(props.codeset.codeset_link);
    const onCodesetNameInput = event => setCodesetName(event.target.value);
    const onCodesetLinkInput = event => setCodesetLink(event.target.value);

    useEffect(()=>{
        setCodesetName(props.codeset.codeset_name);
        setCodesetLink(props.codeset.codeset_link);
    },[props.codeset])

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
            const res = EditCodeset(props.codeset.codeset_id, codesetName, codesetLink);
            if (res) {
                props.onHide();
                window.location.reload();
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
                        <Form.Group className="mb-3">
                            <Form.Label>Codeset ID</Form.Label>
                            <Form.Control type="text" value={props.codeset.codeset_id} disabled />
                        </Form.Group>

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
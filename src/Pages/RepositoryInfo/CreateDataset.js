import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateDataset } from '../../Data/dataset';

function CreateDatasetForm(props) {
    const [validated, setValidated] = useState(false);
    const [DatasetName, setDatasetName] = useState("");
    const [DatasetLink, setDatasetLink] = useState("");
    const onDatasetNameInput = event => { setDatasetName(event.target.value); setValidated(false); }
    const onDatasetLinkInput = event => { setDatasetLink(event.target.value); setValidated(false); }

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) event.stopPropagation();
        else {
            const res = CreateDataset(DatasetName, DatasetLink);
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
                    <Modal.Title>新建Dataset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" >
                            <Form.Label>Dataset name</Form.Label>
                            <Form.Control type="text" onChange={onDatasetNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Dataset link</Form.Label>
                            <Form.Control type="text" onChange={onDatasetLinkInput} required />
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

export default CreateDatasetForm;
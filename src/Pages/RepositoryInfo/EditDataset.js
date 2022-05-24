import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateDataset, EditDataset } from '../../Data/dataset';
import { UserInfo } from '../Utilities/auth';

function EditDatasetForm(props) {
    const [validated, setValidated] = useState(false);
    const [datasetName, setDatasetName] = useState(props.dataset.dataset_name);
    const [datasetLink, setDatasetLink] = useState(props.dataset.dataset_link);
    const onDatasetNameInput = event => setDatasetName(event.target.value);
    const onDatasetLinkInput = event => setDatasetLink(event.target.value);

    useEffect(()=>{
        setDatasetName(props.dataset.dataset_name);
        setDatasetLink(props.dataset.dataset_link);
    },[props.dataset])

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
            EditDataset(UserInfo.token, props.dataset.dataset_id, datasetName, datasetLink).then((data, err) => {
                if(data)window.location.reload();
                else alert(err);
            });
        }
    };

    return (
        <React.Fragment>
            <Modal show={props.show} onHide={() => { props.onHide(); setValidated(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>修改Dataset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Dataset ID</Form.Label>
                            <Form.Control type="text" value={props.dataset.dataset_id} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Dataset name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={datasetName} onChange={onDatasetNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Dataset link</Form.Label>
                            <Form.Control type="text" maxLength="200" value={datasetLink} onChange={onDatasetLinkInput} required />
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

export default EditDatasetForm;
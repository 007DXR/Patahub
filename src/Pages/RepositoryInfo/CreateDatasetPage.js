import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateDataset } from '../../Data/dataset';
import { GoPlus } from 'react-icons/go';

function CreateDatasetAlert(props) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.succ?"创建Dataset成功":"创建Dataset失败"}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export function CreateDatasetButton() {
    return (
        <Button onClick={() => window.location.replace(`/createDataset/`)}>
            <GoPlus />
        </Button>
    )
}

function CreateDatasetPage(props) {
    const [validated, setValidated] = useState(false);
    const [DatasetName, setDatasetName] = useState("");
    const [DatasetLink, setDatasetLink] = useState("");
    const onDatasetNameInput = event => setDatasetName(event.target.value);
    const onDatasetLinkInput = event => setDatasetLink(event.target.value);
    const [ifAlert, setIfAlert] = useState(false);
    const [succ, setSucc] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) {
            setValidated(true)
            event.stopPropagation();
        }
        else {
            setIfAlert(true);
            setValidated(false);
            const res = CreateDataset(DatasetName, DatasetLink);
            if (res) {
                setSucc(true);
            }
            else {
                setSucc(false);
            }
        }
    };

    return (
        <React.Fragment>
            <h3>新建Dataset</h3>
            <Form className="w-50 mx-auto pt-5" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" >
                    <Form.Label>Dataset name</Form.Label>
                    <Form.Control type="text" maxLength="200" onChange={onDatasetNameInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Dataset link</Form.Label>
                    <Form.Control type="text" maxLength="200" onChange={onDatasetLinkInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a link.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit">Create</Button>
            </Form>
            <CreateDatasetAlert show={ifAlert} onHide={() => {setIfAlert(false);window.location.reload()}} succ={succ}/>
        </React.Fragment>
    )
}

export default CreateDatasetPage;
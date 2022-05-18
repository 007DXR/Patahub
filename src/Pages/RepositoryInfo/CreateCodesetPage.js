import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateCodeset } from '../../Data/codeset';
import { GoPlus } from 'react-icons/go';

function CreateCodesetAlert(props) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.succ?"创建Codeset成功":"创建Codeset失败"}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export function CreateCodesetButton() {
    return (
        <Button onClick={() => window.location.replace(`/createCodeset/`)}>
            <GoPlus />Codeset
        </Button>
    )
}

function CreateCodesetPage(props) {
    const userID = 1;
    const [validated, setValidated] = useState(false);
    const [CodesetName, setCodesetName] = useState("");
    const [CodesetLink, setCodesetLink] = useState("");
    const onCodesetNameInput = event => setCodesetName(event.target.value);
    const onCodesetLinkInput = event => setCodesetLink(event.target.value);
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
            const res = CreateCodeset(userID, CodesetName, CodesetLink);
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
            {/* <h3>新建Codeset</h3> */}
            <Form className="w-50 mx-auto pt-5" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" >
                    <Form.Label>Codeset name</Form.Label>
                    <Form.Control type="text" maxLength="200" onChange={onCodesetNameInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Codeset link</Form.Label>
                    <Form.Control type="text" maxLength="200" onChange={onCodesetLinkInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a link.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit">Create</Button>
            </Form>
            <CreateCodesetAlert show={ifAlert} onHide={() => {setIfAlert(false);window.location.reload()}} succ={succ}/>
        </React.Fragment>
    )
}

export default CreateCodesetPage;
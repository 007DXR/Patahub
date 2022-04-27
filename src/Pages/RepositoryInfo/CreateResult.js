import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateResult, getResultListByPaper } from '../../Data/result';

function CreateResultForm(props) {
    const [validated, setValidated] = useState(false);
    const [resultName, setResultName] = useState("");
    const [resultLink, setResultLink] = useState("");
    const [resultType, setResultType] = useState("");
    const [createResultFailure, setCreateResultFailure] = useState(false)
    const onResultNameInput = event => setResultName(event.target.value);
    const onResultLinkInput = event => setResultLink(event.target.value);
    const onResultTypeInput = event => setResultType(event.target.value);

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) event.stopPropagation();
        else {
            const res = CreateResult(resultType, resultName, resultLink, props.paperID);
            if (res) {
                props.onHide();
            }
            else {
                alert("error");
            }
        }
        setValidated(true)
    };

    return (
        <React.Fragment>
            <Modal show={props.show} onHide={() => { props.onHide(); setValidated(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>新建Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" >
                            <Form.Label>result name</Form.Label>
                            <Form.Control type="text" maxLength="200" onChange={onResultNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>result link</Form.Label>
                            <Form.Control type="text" maxLength="200" onChange={onResultLinkInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a link.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>result type</Form.Label>
                            <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" required
                                onChange={onResultTypeInput}>
                                <option value="">choose a result type</option>
                                <option value="link">link</option>
                                <option value="img">img</option>
                                <option value="csv">csv</option>
                                <option value="other(bin)">other(bin)</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please choose a result type.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default CreateResultForm;
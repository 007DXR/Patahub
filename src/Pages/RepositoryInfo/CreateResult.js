import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateResult, getResultListByPaper } from '../../Data/result';

function CreateResultForm(props){
    const [validated, setValidated] = useState(false);
    const [resultName, setResultName] = useState("");
    const [resultLink, setResultLink] = useState("");
    const [resultType, setResultType] = useState("");
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
                // setCreateRepoFailure(true)
                alert("error");
            }
        }
        setValidated(true)
    };

    return (
        <React.Fragment>
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>新建Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>result name</Form.Label>
                            <Form.Control type="text" onChange={onResultNameInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>result link</Form.Label>
                            <Form.Control type="text" onChange={onResultLinkInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid link.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>result type</Form.Label>
                            <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example"
                                onChange={onResultTypeInput}>
                                <option selected>choose a result type</option>
                                <option value="link">link</option>
                                <option value="img">img</option>
                                <option value="csv">csv</option>
                                <option value="other(bin)">other(bin)</option>
                            </Form.Select>
                        </Form.Group>

                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
        
    )
}

export default CreateResultForm;
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateResult, getResultListByPaper } from '../../Data/result';
import { UserInfo } from '../Utilities/auth';

function CreateResultForm(props) {
    const [validated, setValidated] = useState(false);
    const [resultName, setResultName] = useState("");
    const [resultDescription, setResultDescription] = useState("");
    const [resultLink, setResultLink] = useState("");
    // const [resultType, setResultType] = useState("img");
    const [resultValue, setResultValue] = useState(null);
    const [createResultFailure, setCreateResultFailure] = useState(false)
    const onResultNameInput = event => setResultName(event.target.value);
    const onResultDescriptionInput = event => setResultDescription(event.target.value);
    const onResultValueInput = event => setResultValue(event.target.value);
    const onResultLinkInput = event => setResultLink(event.target.value);
    // const onResultTypeInput = event => setResultType(event.target.value);

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
            CreateResult(UserInfo.token, resultName, resultDescription, resultValue, resultLink, props.paperID).then(() => {
                props.onHide();
            }, error=>{alert(error.responseJSON.detail[0].msg)})
        }
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
                            <Form.Label>result description</Form.Label>
                            <Form.Control type="text" maxLength="200" onChange={onResultDescriptionInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a description.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>result value</Form.Label>
                            <Form.Control type="text" maxLength="200" onChange={onResultValueInput} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a value.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>result link</Form.Label>
                            <Form.Control type="text" maxLength="200" onChange={onResultLinkInput} />
                            {/* <Form.Control.Feedback type="invalid">
                                Please provide a link.
                            </Form.Control.Feedback> */}
                        </Form.Group>

                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default CreateResultForm;
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateResult, EditResult } from '../../Data/result';
import { UserInfo } from '../Utilities/auth';

function EditResultForm(props) {
    const [validated, setValidated] = useState(false);
    const [resultName, setResultName] = useState();
    const [resultDescription, setResultDescription] = useState();
    const [resultValue, setResultValue] = useState();
    
    const onResultNameInput = event => setResultName(event.target.value);
    const onResultDescription = event => setResultDescription(event.target.value);
    const onResultValue = event => setResultValue(event.target.value);

    useEffect(()=>{
        setResultName(props.result.result_name);
        setResultDescription(props.result.result_description);
        setResultValue(props.result.result_value);
    },[props.result])

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
            EditResult(UserInfo.token, resultName, resultDescription, resultValue,props.result.paper_id, props.result.result_id).then((data, err) => {
                if(data)window.location.reload();
                else alert(err);
            }, error=>{alert(error.responseJSON.detail[0].msg)});
        }
    };

    return (
        <React.Fragment>
            <Modal show={props.show} onHide={() => { props.onHide(); setValidated(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>修改Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>result name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={resultName} onChange={onResultNameInput} required disabled={props.fixedName}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>result description</Form.Label>
                            <Form.Control type="text" maxLength="200" value={resultDescription} onChange={onResultDescription} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a link.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>result value</Form.Label>
                            <Form.Control type="text" maxLength="200" value={resultValue} onChange={onResultValue} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a value.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default EditResultForm;
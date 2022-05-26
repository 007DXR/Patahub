import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';

function SimpleForm(props){
    const handleChange = (key, value) => {
        props.setValue(prevState =>({
            ...prevState,
            ...Object.fromEntries([[key, value]])
        }));
    }
    return props.keys.map((key)=>(
        <Form.Group className='d-flex mt-2 mb-1'>
            <Form.Label for={key} className="my-auto" style={{whiteSpace:'nowrap'}}>{key}</Form.Label>
            <Form.Control id={key} value={props.value[key]} className="ms-auto w-75" onChange={(event) => handleChange(key,event.target.value)}/>
        </Form.Group>
    ));
}

export default SimpleForm;
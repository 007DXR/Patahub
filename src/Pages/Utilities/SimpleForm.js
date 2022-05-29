import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';

function SimpleForm(props){
    const handleChange = (key, value) => {
        props.setValue(prevState =>({
            ...prevState,
            ...Object.fromEntries([[key, value]])
        }));
    }
    return props.keys.map((obj)=>{
        let key, type, content;
        if(typeof(obj) == 'string') key=obj;
        else{ key = obj.key; type = obj.type; content = obj.content;}
        return(
            <Form.Group className='d-flex mt-2 mb-1'>
                <Form.Label for={key} className="my-auto" style={{whiteSpace:'nowrap'}}>{content ? content : key}</Form.Label>
                <Form.Control id={key} type={type} value={props.value[key]} className="ms-auto w-75" onChange={(event) => handleChange(key,event.target.value)}/>
            </Form.Group>
        );
    });
}

export default SimpleForm;
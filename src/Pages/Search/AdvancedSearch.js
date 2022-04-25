import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const keys = {
    paper: ['paper_name','paper_id'],
    result: ['result_name','result_id','result_type'],
    dataset: ['dataset_name','dataset_id'],
    codeset: ['codeset_name','codeset_id'],
    rcd: ['paper_id','result_id','dataset_id','codeset_id','rcd_id']
};

function AdvancedSearch(props){
    const [searchType, setSearchType] = useState(null);
    const [searchArgs, setSearchArgs] = useState({});
    const handleTypeChange = (value) => {
        if(value != searchType)
            setSearchArgs(keys[value]?Object.fromEntries(keys[value].map(key => [key, ''])):{});
        setSearchType(value);
    }
    const handleArgChange = (key, value) => {
        setSearchArgs(prevState =>({
            ...prevState,
            ...Object.fromEntries([[key, value]])
        }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.replace(`/search/${searchType}/?`+Object.entries(searchArgs).filter((kv)=>kv[1].length>0).map((kv)=>(`${kv[0]}=${kv[1]}`)).join('&'));
    }
    return (<Form className="w-50 mx-auto pt-5" onSubmit={handleSubmit}>
        <Container className='d-flex'>
            <Form.Label for="searchType" className="my-auto" style={{whiteSpace:'nowrap'}}>Data Type </Form.Label>
            <Form.Select id="searchType" className="ms-auto w-75" onChange={(event) => {handleTypeChange(event.target.value)}}>
                <option></option>
                <option value="paper">paper</option>
                <option value="result">result</option>
                <option value="dataset">dataset</option>
                <option value="codeset">code</option>
                <option value="rcd">RCD</option>
            </Form.Select>
        </Container>
        {searchType?keys[searchType].map((key)=>(
            <Container className='d-flex mt-3'>
                <Form.Label for={key} className="my-auto" style={{whiteSpace:'nowrap'}}>{key}</Form.Label>
                <Form.Control id={key} value={searchArgs[key]} className="ms-auto w-75" onChange={(event) => handleArgChange(key,event.target.value)}/>
            </Container>
        )):null}
        <Button type="submit" className='mt-3' disabled={!searchType} >Search</Button>
    </Form>);
}
export default AdvancedSearch;
import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SimpleForm from '../Utilities/SimpleForm';

const keys = {
    paper: [{key: 'paper_name', content: 'Paper Name'},
        {key: 'paper_id', content: 'Paper ID'}],
    result: [{key: 'result_name', content: 'Result Name'},
        {key: 'result_id', content: 'Result ID'}],
    dataset: [{key: 'dataset_name', content: 'Dataset Name'},
        {key: 'dataset_id', content: 'Dataset ID'}],
    rcd: [{key: 'paper_id', content: 'Paper ID'},
        {key: 'result_id', content: 'Result ID'},
        {key: 'dataset_id', content: 'Dataset ID'},
        {key: 'rcd_id', content:'RMD ID'}],
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
                <option value="rcd">RMD</option>
            </Form.Select>
        </Container>
        {searchType?<SimpleForm keys={keys[searchType]} value={searchArgs} setValue={setSearchArgs}/>:null}
        <Button type="submit" className='mt-3' disabled={!searchType} >Search</Button>
    </Form>);
}
export default AdvancedSearch;
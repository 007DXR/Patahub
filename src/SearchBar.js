import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { GoSearch } from 'react-icons/go';
import { AiOutlineFileSearch } from 'react-icons/ai';
import $ from 'jquery';

function SearchBar() {
    const [op, setOp] = useState("none");
    const [placeholder, setPlaceholder] = useState('');
    const [content, setContent] = useState("");
    const disabled = !(op!="none" && content.length > 0);
    const getSearchInfo = (event) => {
        event.preventDefault();
        if(!disabled)window.location.replace(`/search/${placeholder}/?${op}=${content}`);
    }
    return (
        <Form className="d-flex" onSubmit={getSearchInfo} onKeyDown={()=>{}}>
            <Form.Select aria-label="Default select example" className="me-1 w-50" value={op}
                onChange={(event) => {
                    setOp(event.target.value); 
                    setPlaceholder($(event.target).children().filter(`[value=${event.target.value}]`).attr('description'));
                }}>
                <option value="none" description="">Search...</option>
                <option value="paper_name" description="paper">paper</option>
                <option value="result_name" description="result">result</option>
                <option value="dataset_name" description="dataset">dataset</option>
                <option value="codeset_name" description="codeset">code</option>
            </Form.Select>
        <FormControl
            type="text" 
            placeholder={'Search '+placeholder+'...'}
            value={content}
            onChange={(event) => { setContent(event.target.value); }}
        />
        {disabled ?
            (<Button type="submit" variant="gray" className="ms-1" disabled><GoSearch /></Button>)
            : (<Button type="submit" variant="info"className="ms-1" ><GoSearch /></Button>)
        }
        <Button type="button" variant="info" title="Advanced Search" className="ms-1"
            onClick={() => window.location.replace(`/advancedSearch/`)}>
            <AiOutlineFileSearch />
        </Button>
        </Form>
    )
}
  
export default SearchBar;
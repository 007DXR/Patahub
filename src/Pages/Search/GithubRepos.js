import React from 'react';
import { useEffect, useState } from 'react';
import GithubRepoInfo from '../Utilities/GithubRepoInfo/GithubRepoInfo';
import { searchAll } from '../../Data/link.js';
import { Card, CardGroup, Container, Row } from 'react-bootstrap';


function GithubRepos(props){
    const [links, setLinks] = useState([]);
    useEffect(()=>{
        searchAll(props.op,props.params).then((data,err) => {
            if(data)setLinks(data);
        });
    },[]);
    const linkKeyName = props.op+"_link";
    return(<Container className="w-50 pt-5">
        {links.map((linkObj) => (
            <Row>
                <GithubRepoInfo link={linkObj[linkKeyName]}/>
            </Row>
        ))}
    </Container>)
}
export default GithubRepos;
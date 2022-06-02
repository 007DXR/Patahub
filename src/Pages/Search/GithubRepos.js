import React from 'react';
import { useEffect, useState } from 'react';
import GithubRepoInfo from '../Utilities/GithubRepoInfo/GithubRepoInfo';
import { searchAll } from '../../Data/link.js';
import { Card, CardGroup, Container, Row } from 'react-bootstrap';
import DatasetCard from '../RepositoryInfo/DatasetCard';
import ResultCard from '../RepositoryInfo/ResultCard';


function GithubRepos(props){
    const [links, setLinks] = useState([]);
    useEffect(()=>{
        searchAll(props.op,props.params).then((data,err) => {
            if(data)setLinks(data);
        });
    },[]);
    return(<Container className="w-50 pt-5">
        {links.map((linkObj) => (
            <Row>
                {props.op == 'dataset' ? 
                <DatasetCard dataset={linkObj} edit={false}/>
                : <ResultCard result={linkObj} edit={false}/>}
            </Row>
        ))}
    </Container>)
}
export default GithubRepos;
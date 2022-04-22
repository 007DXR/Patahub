import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { getRCDList } from '../../Data/demo.js'
import { Container, Row } from 'react-bootstrap';
import EmptyRCDOverView from './EmptyRCDOverView.js';

function RepositoryInfo(props){
    const repoName = useParams().repoName;
    const [RCDList, setRCDList] = useState([]);
    
    useEffect( () => {
        getRCDList(repoName).then((data, err) => {
            setRCDList(data);
        });
    } ,[]);
    
    function getRCDItem(newRCD){
        setRCDList([...RCDList, {
            resultId: RCDList.length+1, 
            resultImage: newRCD.resultImage,
            codeLinks: newRCD.codeLinks,
            datasetLinks: newRCD.datasetLinks,
        }])
    }

    const delRCD = index => {
        setRCDList([...RCDList.slice(0, index), ...RCDList.slice(index + 1)]);
    }

    return (
        <Container className='pt-5'>
            {
                RCDList.map((RCD, index) => <RCDOverView repoName={repoName} RCD={RCD}
                onRemove={() => delRCD(index)}/>)
            }
            <Row><EmptyRCDOverView sendValueToFa={getRCDItem.bind(this)}/></Row>
        </Container>
    )
}
export default RepositoryInfo;
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRCD } from '../../Data/demo.js';
import { Container, Row, Col, Image } from 'react-bootstrap';

function RCDInfo(props){
    let p = useParams();
    const [repoName, RCDId] = [p.repoName, p.RCDId];
    const [RCD, setRCD] = useState(null);
    useEffect(() => {
        getRCD(repoName, RCDId).then((data, err) => {
            setRCD(data);
        });
    } ,[]);
    return RCD ? (
        <Container>
            <Row>
                <Image src={RCD.resultImage} fluid/>
            </Row>
            <Row>
                <Col>左边</Col>
                <Col>右边</Col>
            </Row>
        </Container>
    ) : null;
}

export default RCDInfo;

import React from 'react';
import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import GithubRepoInfo from "../Utilities/GithubRepoInfo/GithubRepoInfo.js"
// import "./RCDOverView.css";
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { GoX, GoPlus, GoCheck } from 'react-icons/go';
import { RiEditFill } from 'react-icons/ri';

function RCDOverView(props){
    const delRCD = () => {
        props.onRemove(props.RCD.rcdId);
    }
    
    return (
        <Row className="RCDOverView">
            <Col>
                <Link to={`/RCDInfo/${props.repoName}/${props.RCD.resultId}`}>
                    <Image src={props.RCD.resultImage} style={{height: '50px'}} />
                </Link> 
            </Col>
            <Col>
                <GithubRepoInfo link={props.RCD.codeLink}>somecode</GithubRepoInfo>
            </Col>
            <Col>
                    <GithubRepoInfo link={props.RCD.dataLink}>somedata</GithubRepoInfo>                
            </Col>
            <Col>
                <Button onClick={()=>props.onEdit(props.RCD)} className="btn-sm"><RiEditFill /></Button>
                <Button onClick={delRCD} className="btn-sm btn-danger"><BsFillTrashFill/></Button>
            </Col>
        </Row>
    )
}
export default RCDOverView;
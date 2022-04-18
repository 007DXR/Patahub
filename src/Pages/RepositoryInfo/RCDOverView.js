import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";
import GithubRepoInfo from "../Utilities/GithubRepoInfo/GithubRepoInfo.js"
import "./RCDOverView.css";

function RCDOverView(props){
    return (
        <Row className="RCDOverView">
            <Col>
                <Link to={`/RCDInfo/${props.repoName}/${props.RCD.resultId}`}>
                    <Image src={props.RCD.resultImage} style={{height: '50px'}} />
                </Link> 
            </Col>
            <Col>
                {props.RCD.codeLinks.map((codeLink) => <div>
                    <GithubRepoInfo link={codeLink}>somecode</GithubRepoInfo><br />
                </div>)}
            </Col>
            <Col>
                {props.RCD.datasetLinks.map((datasetLink) => <div>
                    <GithubRepoInfo link={datasetLink}>somedata</GithubRepoInfo><br />
                </div>)}
            </Col>
        </Row>
    )
}
export default RCDOverView;

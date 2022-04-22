import React, { useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import GithubRepoInfo from "../Utilities/GithubRepoInfo/GithubRepoInfo.js"
import EmptyRCDOverView from './EmptyRCDOverView.js';
import { RiEditFill } from 'react-icons/ri'
import { GoCheck } from 'react-icons/go';

function RCDOverView(props){
    const [onEdit, setOnEdit] = useState(false);
    const onFinish = (newCodeList, newDataList) => {
        setOnEdit(false);
        //调用api修改
    }
    return (
        <Row>
            <Col>
                <Link to={`/RCDInfo/${props.repoName}/${props.RCD.resultId}`}>
                    <Image src={props.RCD.resultImage} style={{height: '50px'}} />
                </Link> 
            </Col>
            {onEdit?
                <EmptyRCDOverView noInterface={true} onFinish={onFinish} codeLinks={props.RCD.codeLinks} dataLinks={props.RCD.datasetLinks} />
            :(
                <React.Fragment>
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
                </React.Fragment>
            )}
            {onEdit?
                <React.Fragment />:
                <Col><Button className="btn-sm" onClick={() =>{setOnEdit(true)}} ><RiEditFill /></Button></Col>
            }
            
        </Row>
    )
}
export default RCDOverView;
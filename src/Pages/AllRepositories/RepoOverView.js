import React from 'react';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import { GoTrashcan } from 'react-icons/go';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function DeteleRepo(id) {
    await sleep(Math.round(Math.random() * 2000));
    return Math.random() < 0.5 ? true : false;
}

function RepoOverView(props) {
    const [repoInfo, setRepoInfo] = useState(null);
    useEffect(() => {
        getRepositoryInfo(props.repoName).then((data, err) => {
            setRepoInfo(data);
            console.log(data);
        });
    }, []);
    return repoInfo ? (
        <React.Fragment>
            <div style={{display: 'inline-flex'}}>
                <Link to={'/repositoryInfo/' + props.repoName}>
                    <h1 className="repositoryPaperOverView-title">{repoInfo.paperTitle}</h1>
                </Link>
                <Button variant="primary" onClick={async function () {
                    const res = await DeteleRepo(repoInfo.id)
                    if (res) {
                        props.onDelete(1)
                        setRepoInfo(null)
                    }
                    else props.onDelete(2)
                }} style={{marginLeft:'20px'}}
                className="btn-danger">
                    <GoTrashcan />
                </Button>
            </div>
            <Container>
                <Row>
                    <Col>
                        {repoInfo.dataSetDescription}
                    </Col>
                    <Col>
                        {repoInfo.dataSetLink[0]}
                    </Col>
                </Row>
            </Container>
        </React.Fragment >
    ) : (
        <React.Fragment></React.Fragment>
    );
}

export default RepoOverView;

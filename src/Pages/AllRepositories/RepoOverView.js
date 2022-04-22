import React from 'react';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import { GoTrashcan } from 'react-icons/go';
import DeleteRepoButton, { DeleteRepo } from './DeleteRepo.js'
const sleep = ms => new Promise(r => setTimeout(r, ms));

/*async function DeteleRepo(id) {
    await sleep(Math.round(Math.random() * 2000));
    return Math.random() < 0.5 ? true : false;
}*/

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
            <div class="d-flex mt-3">
                <Link to={'/repositoryInfo/' + props.repoName} className="text-decoration-none">
                    <h2 className="mt-2" style={{color: 'black'}}>{repoInfo.paperTitle}</h2>
                </Link>
                <Button variant="primary h-50 align-self-center" onClick={async function () {
                    const res = await DeleteRepo(repoInfo.id)
                    if (res) {
                        props.onDelete(1)
                        setRepoInfo(null)
                    }
                    else props.onDelete(2)
                }}
                className="bg-transparent border-0 btm-sm ms-2 p-1">
                    <GoTrashcan color='red'/>
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

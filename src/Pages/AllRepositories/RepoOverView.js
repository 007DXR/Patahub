import React from 'react';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
        <Card className='mt-3'>
            <Card.Body>
                <Card.Title className="d-flex">
                    <Link to={'/repositoryInfo/'+props.repoName} className="text-start fw-bold mt-2 text-decoration-none" style={{color: 'black'}}>{repoInfo.paperTitle}</Link>
                    <DeleteRepoButton paperId={repoInfo.id} />
                </Card.Title>
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
            </Card.Body>
        </Card>
    ) : (
        <React.Fragment/>
    );
}

export default RepoOverView;
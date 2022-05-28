import React from 'react';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import { GoTrashcan } from 'react-icons/go';
import { UpdateRepoButton } from './CreateRepo.js';
import { UserInfo } from '../Utilities/auth.js';

function RepoOverView(props) {
    const repoInfo = props.repoInfo;
    return repoInfo ? (
        <Card className='mt-3'>
            <Card.Body>
                <Card.Title className="d-flex" style={{wordBreak: 'break-all'}}>
                    <Link to={'/repositoryInfo/' + repoInfo.paper_id} className="text-start fw-bold mt-2 text-decoration-none" style={{ color: 'black' }}>{repoInfo.paper_name}</Link>
                </Card.Title>
                <Container className='text-start'>
                    <Row className='my-2'>
                        <Col>
                            <a className='text-body' href={repoInfo.paper_link}>{repoInfo.paper_link}</a>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {repoInfo.paper_abstract}
                        </Col>
                    </Row>
                    {/* <Row>{repoInfo.docker_link}</Row> */}
                </Container>
            </Card.Body>
        </Card>
    ) : (
        <React.Fragment />
    );
}

export default RepoOverView;
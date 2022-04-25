import React from 'react';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import { GoTrashcan } from 'react-icons/go';
import DeleteRepoButton, { DeleteRepo } from './DeleteRepo.js'

function RepoOverView(props) {
    const repoInfo = props.repoInfo;
    return repoInfo ? (
        <Card className='mt-3'>
            <Card.Body>
                <Card.Title className="d-flex" style={{wordBreak: 'break-all'}}>
                    <Link to={'/repositoryInfo/' + repoInfo.paper_id} className="text-start fw-bold mt-2 text-decoration-none" style={{ color: 'black' }}>{repoInfo.paper_name}</Link>
                    <DeleteRepoButton paperId={repoInfo.paper_id} />
                </Card.Title>
                <Container>
                    <Row>
                        <Col>
                            {repoInfo.paper_abstract}
                        </Col>
                        <Col>
                            {repoInfo.paper_link}
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    ) : (
        <React.Fragment />
    );
}

export default RepoOverView;
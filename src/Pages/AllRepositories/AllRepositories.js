import React from 'react';
import { searchRepositories } from '../../Data/link.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'
import CreateRepoComponent from './CreateRepo.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Placeholder from 'react-bootstrap/Placeholder'

function AllRepositories() {
    const params = useParams(), op = params.op, content = params.content;
    let searchArgs = [null, null, null]; searchArgs[op] = content;
    const [repoList, setRepoList] = useState([]);
    useEffect(() => {
        searchRepositories(...searchArgs).then((data, err) => {
            setRepoList(data);
            console.log(data);
        });
    }, []);
    return (
        <div>
            {repoList.map((repoName) => <RepoOverView repoName={repoName} />)}
            <CreateRepoComponent />
        </div>
    );
}

export default AllRepositories;
/*
            <Card>
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
*/
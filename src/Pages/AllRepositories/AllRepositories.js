import React from 'react';
import { searchRepositories } from '../../Data/link.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'
import CreateRepoComponent from './CreateRepo.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom';

function AllRepositories() {
    const params = useParams(), op=params.op, content=params.content;
    let searchArgs = [null,null,null]; searchArgs[op]=content;
    const [repoList, setRepoList] = useState([]);
    const [showDeleteRepoAlert, setShowDeleteRepoAlert] = useState(0)
    useEffect(() => {
        searchRepositories(...searchArgs).then((data, err) => {
            setRepoList(data);
            console.log(data);
        });
    }, []);
    return (
        <div className='w-75 mx-auto'>
            {repoList.map((repoName) => <RepoOverView repoName={repoName} onDelete={(status) => setShowDeleteRepoAlert(status)} />)}
            <DeleteRepoAlert status={showDeleteRepoAlert} onHide={() => setShowDeleteRepoAlert(0)} />
        </div>
    );
}

export default AllRepositories;

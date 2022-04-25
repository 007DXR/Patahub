import React from 'react';
import { searchRepositories } from '../../Data/link.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'
import CreateRepoComponent from './CreateRepo.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom';
import { DeleteRepoAlert } from './DeleteRepo.js'

function AllRepositories(props) {
    const [repoList, setRepoList] = useState([]);
    console.log(props.params);
    useEffect(() => {
        searchRepositories(props.params ).then((data, err) => {
            setRepoList(data);
        });
    }, []);
    return (
        <div className='w-75 mx-auto'>
            {repoList.map((repoInfo) => <RepoOverView repoInfo={repoInfo} />)}
        </div>
    );
}

export default AllRepositories;
import React from 'react';
import { searchRepositories } from '../../Data/link.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'
import CreateRepoComponent from './CreateRepo.js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom';
import { DeleteRepoAlert } from './DeleteRepo.js'

function AllRepositories() {
    const params = useParams()
    let options = {}
    if (params.op) options[params.op] = params.content
    const [repoList, setRepoList] = useState([]);
    useEffect(() => {
        searchRepositories(options).then((data, err) => {
            setRepoList(data);
            console.log(data);
        });
    }, []);
    return (
        <div className='w-75 mx-auto'>
            {repoList.map((repoInfo) => <RepoOverView repoInfo={repoInfo} />)}
        </div>
    );
}

export default AllRepositories;
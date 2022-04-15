import React from 'react';
import './AllRepositories.css';
import { getAllRepositories } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'
import CreateRepo from './CreateRepo.js'

function AllRepositories() {
    const [repoList, setRepoList] = useState([]);
    useEffect(() => {
        getAllRepositories().then((data, err) => {
            setRepoList(data);
            console.log(data);
        });
    }, []);
    return (
        <div>
            {repoList.map((repoName) => <RepoOverView repoName={repoName} />)}
            <CreateRepo />
        </div>
    );
}

export default AllRepositories;

import React from 'react';
import { getAllRepositories } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'

function AllRepositories() {
    const [repoList, setRepoList] = useState([]);
    useEffect(() => {
        getAllRepositories().then((data, err) => {
            setRepoList(data);
            console.log(data);
        });
    }, []);
    return (
        repoList.map((repoName) => <RepoOverView repoName={repoName} />)
    );
}

export default AllRepositories;

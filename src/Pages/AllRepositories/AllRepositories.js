import React from 'react';
import { searchRepositories } from '../../Data/link.js'
import { useEffect, useState } from 'react';
import RepoOverView from './RepoOverView.js'

function AllRepositories(props) {
    const [repoList, setRepoList] = useState([]);
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
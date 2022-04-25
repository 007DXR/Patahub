import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AllRepositories from '../AllRepositories/AllRepositories.js';
import GithubRepos from './GithubRepos.js'

function Search(props){
    const params = useParams();
    if (params.op == 'paper') return <AllRepositories op={params.by} content={params.content}/>;
    if (params.op == 'result' || params.op == 'codeset' || params.op == 'dataset')
        return <GithubRepos op={params.op} by={params.by} content={params.content}/>;
}
export default Search;
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AllRepositories from '../AllRepositories/AllRepositories.js';
import GithubRepos from './GithubRepos.js'
import { useQuery } from '../../Data/link.js';
import $ from 'jquery';

function Search(props){
    const params = useParams(), query = useQuery();
    if (params.op == 'paper') return <AllRepositories op={params.by} params={query}/>;
    if (params.op == 'result' || params.op == 'codeset' || params.op == 'dataset')
        return <GithubRepos op={params.op} params={query}/>;
}
export default Search;
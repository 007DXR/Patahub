// import { prependOnceListener } from 'process';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGithubRepoInfo, parseGithubLink } from "../../../Data/github.js"

function GithubRepoInfo(props){
    let [ownername, repoName] = parseGithubLink(props.link);
    const [errInfo, setErrInfo] = useState();
    const [info, setInfo] = useState();
    useEffect( () => {
        if(ownername){
            getGithubRepoInfo(ownername, repoName).then((data, err) => {
                setInfo(data);
                setErrInfo(err);
            });
        }
    }, []);
    return errInfo ? (
        <p>
        {errInfo}
        </p>
    ) : (info ? (
        <a href={info.html_url} style={{color: 'black', textDecoration: 'none'}} >
            <p className='h6'>{info.name} | {info.watchers } stars</p>
            <p>{info.description}</p>
        </a>
    ) : (
        <p>
            No valid data
        </p>
    ));
}
export default GithubRepoInfo;
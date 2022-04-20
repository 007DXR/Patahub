// import { prependOnceListener } from 'process';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGithubRepoInfo } from "../../../Data/github.js"

function GithubRepoInfo(props){
    const regex = /https\:\/\/github\.com\/(.*)\/(.*)$/i;
    const matchInfo = props.link.match(regex);
    const [ownerName, setOwnerName] = useState();
    const [repoName, setRepoName] = useState();
    const [errInfo, setErrInfo] = useState();
    const [info, setInfo] = useState();
    useEffect( () => {
        if(matchInfo){
            setOwnerName(matchInfo[1]);
            setRepoName(matchInfo[2]);
            getGithubRepoInfo(matchInfo[1], matchInfo[2]).then((data, err) => {
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
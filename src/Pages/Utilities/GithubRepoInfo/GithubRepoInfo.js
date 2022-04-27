// import { prependOnceListener } from 'process';
import React, { useEffect, useState } from 'react';
import { GoStar } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { getGithubRepoInfo, parseGithubLink } from "../../../Data/github.js"

function GithubRepoInfo(props){
    const [errInfo, setErrInfo] = useState();
    const [info, setInfo] = useState();
    let ownerName, repoName;
    if(!errInfo)
        try{
            [ownerName, repoName] = parseGithubLink(props.link);
        }catch(err){
            setErrInfo(err);
        }
    useEffect( () => {
        if(ownerName && !errInfo){
            getGithubRepoInfo(ownerName, repoName).then((data, err) => {
                setInfo(data);
                setErrInfo(err);
            });
        }
    }, [])
    return errInfo ? (
        <p>
        {errInfo}
        </p>
    ) : (info ? (
        <a href={info.html_url} style={{color: 'black'}} className="text-decoration-none text-start">
            <h5 className='fw-bold'>{info.name} | <GoStar className='pb-1' size={22} /> {info.watchers }</h5>
            <p>{info.description}</p>
        </a>
    ) : (
        <p className="text-start">
            Loading...
        </p>
    ));
}
export default GithubRepoInfo;
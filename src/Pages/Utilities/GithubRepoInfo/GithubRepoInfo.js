// import { prependOnceListener } from 'process';
import React, { useEffect, useState } from 'react';
import { GoStar } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { getGithubRepoInfo, parseGithubLink } from "../../../Data/github.js"

function GithubRepoInfo(props){
    const [errInfo, setErrInfo] = useState();
    const [info, setInfo] = useState();
    const [linkInfo, setLinkInfo] = useState({});
    const onLinkChange = () => {
        setErrInfo('');
        try{
            let [ownerName, repoName] = parseGithubLink(props.link);
            setLinkInfo({ownerName, repoName});
        }catch(err){
            setErrInfo(err);
        }
    }
    useEffect( onLinkChange , []);
    useEffect( onLinkChange , [props.link]);
    useEffect(() => {
        if(linkInfo.ownerName && !errInfo){
            getGithubRepoInfo(linkInfo.ownerName, linkInfo.repoName).then((data, err) => {
                setInfo(data);
                setErrInfo(err);
            });
        }
    }, [linkInfo, errInfo]);
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
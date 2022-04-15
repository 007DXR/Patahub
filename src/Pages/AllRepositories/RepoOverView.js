import React from 'react';
import './RepoOverView.css';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';


function RepoOverView(props) {
    const [repoInfo, setRepoInfo] = useState(null);
    useEffect(() => {
        getRepositoryInfo(props.repoName).then((data, err) => {
            setRepoInfo(data);
            console.log(data);
        });
    }, []);
    return repoInfo?(
        <React.Fragment>
            <Link to={'/repositoryInfo/'+props.repoName}>
                <h1 className="repositoryPaperOverView-title">{repoInfo.paperTitle}</h1>
            </Link>
            <div className="repositoryOverView">
                <div className="repositoryPaperOverView">
                    <p className="repositoryPaperOverView-description">{repoInfo.dataSetDescription}</p>
                </div>
                <div className="repositoryDataOverView">
                    <p className="repositoryDataOverView-dataset">{repoInfo.dataSetLink[0]}</p>
                </div>
            </div>
        </React.Fragment>
    ):(
        <></>
    );
}

export default RepoOverView;

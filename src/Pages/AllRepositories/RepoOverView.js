import React from 'react';
import './RepoOverView.css';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Button } from 'bootstrap';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function DeteleRepo(id) {
    await sleep(Math.round(Math.random() * 2000));
    return Math.random() < 0.5 ? true : false;
}

function RepoOverView(props) {
    const [repoInfo, setRepoInfo] = useState(null);
    useEffect(() => {
        getRepositoryInfo(props.repoName).then((data, err) => {
            setRepoInfo(data);
            console.log(data);
        });
    }, []);
    return repoInfo ? (
        <React.Fragment>
            <Link to={'/repositoryInfo/' + props.repoName}>
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
            <button onClick={async function () {
                const res = await DeteleRepo(repoInfo.id)
                if (res) {
                    setRepoInfo(null);
                    alert('成功删除仓库')
                }
                else alert('仓库不存在')
            }}>Delete</button>
        </React.Fragment>
    ) : (
        <></>
    );
}

export default RepoOverView;

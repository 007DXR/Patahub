import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRCD } from '../../Data/demo';
import "./RCDInfo.css";

function RCDInfo(props){
    let p = useParams();
    const [repoName, RCDId] = [p.repoName, p.RCDId];
    const [RCD, setRCD] = useState(null);
    useEffect(() => {
        getRCD(repoName, RCDId).then((data, err) => {
            setRCD(data);
        });
    } ,[]);
    return RCD ? (
        <React.Fragment>
            <img className="RCDOverView-ResultList" src={RCD.resultImage} />
            <div className="RCD-CDContainer">
                <div className="RCDCodeInfo">还没</div>
                <div className="RCDDataInfo">写好</div>
            </div>
        </React.Fragment>
    ) : null;
}

export default RCDInfo;

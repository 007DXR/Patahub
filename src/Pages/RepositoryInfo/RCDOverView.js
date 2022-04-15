import React from 'react';
import './RCDOverView.css';
import { Link } from "react-router-dom";

function RCDOverView(props){
    return (
        <div className="RCDOverView">
            <Link to={`/RCDInfo/${props.repoName}/${props.RCD.resultId}`}>
                <img className="RCDOverView-ResultList" src={props.RCD.resultImage} style={{height: '50px'}} />
            </Link>
            <div className="RCDOverView-CodeList">
                {props.RCD.codeLinks.map((codeLink) => <div>
                    <Link className="RCDOverView-Code" to={codeLink}>somecode</Link><br />
                </div>)}
            </div>
            <div className="RCDOverView-DatasetList">
                {props.RCD.datasetLinks.map((datasetLink) => <div>
                    <Link className="RCDOverView-Dataset" to={datasetLink}>somedata</Link><br />
                </div>)}
            </div>
        </div>
    )
}
export default RCDOverView;

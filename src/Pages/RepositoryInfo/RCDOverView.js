import React from 'react';
import './RCDOverView.css';
import { Link } from "react-router-dom";

function RCDOverView(props){
    return (
        <div className="RCDOverView">
            <div className="RCDOverView-ResultList">
                {props.RCD.resultLink}
            </div>
            <div className="RCDOverView-CodeList">
                {props.RCD.codeLinks.map((codeLink) => <><Link className="RCDOverView-Code" to={codeLink}>somecode</Link><br /></>)}
            </div>
            <div className="RCDOverView-DatasetList">
                {props.RCD.datasetLinks.map((datasetLink) => <><Link className="RCDOverView-Dataset" to={datasetLink}>somedata</Link><br /></>)}
            </div>
        </div>
    )
}
export default RCDOverView;
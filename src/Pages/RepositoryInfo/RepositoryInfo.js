import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { getRCDList } from '../../Data/demo.js'
import { Container } from 'react-bootstrap';

function RepositoryInfo(props){
    const repoName = useParams().repoName;
    const [RCDList, setRCDList] = useState([]);
    useEffect( () => {
        getRCDList(repoName).then((data, err) => {
            setRCDList(data);
        });
    } ,[]);
    return (
        <div>
            <p>上面有几个按钮，懒得写了</p>
            <Container>
                {
                    RCDList.map((RCD) => <RCDOverView repoName={repoName} RCD={RCD}/>)
                }
            </Container>
        </div>
    )
}
export default RepositoryInfo;
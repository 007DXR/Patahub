import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { getRCDList } from '../../Data/demo.js'
import { Container, Row, Col, Button } from 'react-bootstrap';

function NewLinkItem(props){
    const [newAddr, setNewAddr] = useState("");
    function sendValueToFa(){
        props.sendValueToFa(newAddr);
    }
    const saveBtn = () => {
        if(newAddr!==""){
            // send code/data link to father component
            sendValueToFa();
            setNewAddr("");
        }
    }
    return (
        <div>
            <input type="text" value={newAddr} 
            onChange={event => setNewAddr(event.target.value)}></input>
            <Button onClick={saveBtn}>save</Button>
        </div>
    );
}

function OldLinkItem(props){
    return (
        <div>
            <input type="text" value={props.addrLink} ></input>
            <Button onClick={props.onRemove}>delete</Button>
        </div>
    );
}

function RepositoryInfo(props){
    const repoName = useParams().repoName;
    const [RCDList, setRCDList] = useState([]);
    const [newResult, setNewResult] = useState("");
    const [newCode, setNewCode] = useState("");
    const [newData, setNewData] = useState("");
    const [newCodeList, setNewCodeList] = useState([]);
    const [newDataList, setNewDataList] = useState([]);
    const [showEmptyCode, setShowEmptyCode] = useState(true);
    const [showEmptyData, setShowEmptyData] = useState(true);
    useEffect( () => {
        getRCDList(repoName).then((data, err) => {
            setRCDList(data);
        });
    } ,[]);
    useEffect( () => {
        if(newCode !== ""){
            saveToCodeList();
        }
    }, [newCode]);
    useEffect( () => {
        if(newData !== ""){
            saveToDataList();
        }
    }, [newData]);

    function getCodeItem(codeLink){
        setNewCode(codeLink);
    }
    function getDataItem(dataLink){
        setNewData(dataLink);
    }
    const addRCD = newRCD => setRCDList([...RCDList, newRCD]);
    const addCodeLink = newCodeLink => setNewCodeList([...newCodeList, newCodeLink]);
    const addDataLink = newDataLink => setNewDataList([...newDataList, newDataLink]);
    const delCodeLink = index => {
        setNewCodeList([...newCodeList.slice(0, index), ...newCodeList.slice(index + 1)]);
    }
    const delDataLink = index => {
        setNewDataList([...newDataList.slice(0, index), ...newDataList.slice(index + 1)]);
    }
    const saveToCodeList = () => {
        addCodeLink(newCode);
        setNewCode("");
        setShowEmptyCode(false);
    }
    const saveToDataList = () => {
        addDataLink(newData);
        setNewData("");
        setShowEmptyData(false);
    }
    const addCodeLinkClick = () => {
        setShowEmptyCode(true);
    }
    const addDataLinkClick = () => {
        setShowEmptyData(true);
    }
    const addRCDClick = () => {
        if (newResult === "") {
            return;
        }
        addRCD({  
            resultId: RCDList.length+1, 
            resultImage: newResult,
            codeLinks: newCodeList,
            datasetLinks: newDataList,
        });
        console.log(newResult,RCDList[RCDList.length-1].resultId, RCDList[RCDList.length-1].resultImage);
        setNewResult("");
        setNewCode("");
        setNewData("");
        setNewCodeList([]);
        setNewDataList([]);
        setShowEmptyCode(true);
        setShowEmptyData(true);
    };

    return (
        <div>
            <p>上面有几个按钮，懒得写了</p>
            <Container>
                {
                    RCDList.map((RCD) => <RCDOverView repoName={repoName} RCD={RCD}/>)
                }
                <Row className="RCDOverView">
                    <Col>
                        <input type="text" value={newResult}
                        onChange={event => setNewResult(event.target.value)}/>
                    </Col>
                    <Col>
                        {newCodeList.map((codeLink, index) => {
                            return <OldLinkItem addrLink={codeLink} onRemove={() => delCodeLink(index)} />;
                        })}
                        {(showEmptyCode||newCodeList.length == 0)?<NewLinkItem sendValueToFa={getCodeItem.bind(this)}></NewLinkItem>:""}
                        <Button onClick={addCodeLinkClick}>add code link</Button>
                    </Col>
                    <Col>
                        {newDataList.map((dataLink, index) => {
                            return <OldLinkItem addrLink={dataLink} onRemove={() => delDataLink(index)} />;
                        })}
                        {(showEmptyData||newDataList.length == 0)?<NewLinkItem sendValueToFa={getDataItem.bind(this)}></NewLinkItem>:""}
                        <Button onClick={addDataLinkClick}>add data link</Button> 
                    </Col>
                    <Col>
                        <Button onClick={addRCDClick}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default RepositoryInfo;
import React from 'react';
import { useEffect, useState } from "react";
import { Row, Col, Button } from 'react-bootstrap';
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { GoX, GoPlus, GoCheck } from 'react-icons/go';

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
            <Button onClick={saveBtn} className="ms-1 btn-sm"><GoCheck/></Button>
        </div>
    );
}

function OldLinkItem(props){
    return (
        <div>
            <input type="text" value={props.addrLink} ></input>
            <Button onClick={props.onRemove} className="ms-1 btn-sm btn-danger"><BsFillTrashFill/></Button>
        </div>
    );
}

function FakeNewLinkItem(props){
    return (
        <div>
            <input type="text" placeholder={props.placeholder} disabled></input>
            <Button onClick={props.newItem} className="ms-1 btn-sm"><GoPlus/></Button>
        </div>
    );
}

function EmptyRCDOverView(props){
    const [newResult, setNewResult] = useState("");
    const [newCode, setNewCode] = useState("");
    const [newData, setNewData] = useState("");
    const [newCodeList, setNewCodeList] = useState(props.codeLinks?props.codeLinks:[]);
    const [newDataList, setNewDataList] = useState(props.dataLinks?props.dataLinks:[]);
    const [showEmptyCode, setShowEmptyCode] = useState(true);
    const [showEmptyData, setShowEmptyData] = useState(true);

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

    function sendValueToFa(RCD){
        props.sendValueToFa(RCD);
    }

    const addRCDClick = () => {
        if (newResult === "") {
            return;
        }
        sendValueToFa({   
            resultImage: newResult,
            codeLinks: newCodeList,
            datasetLinks: newDataList,
        });
        setNewResult("");
        setNewCode("");
        setNewData("");
        setNewCodeList([]);
        setNewDataList([]);
        setShowEmptyCode(true);
        setShowEmptyData(true);
    };

    return (
        <React.Fragment>
            {props.noInterface?<React.Fragment />:
            <Col>
                <input type="text" value={newResult} placeholder='Enter your result link'
                onChange={event => setNewResult(event.target.value)}/>
            </Col>
            }
            <Col>
                {newCodeList.map((codeLink, index) => {
                    return <OldLinkItem addrLink={codeLink} onRemove={() => delCodeLink(index)} />;
                })}
                {(showEmptyCode||newCodeList.length == 0)?
                (<NewLinkItem sendValueToFa={getCodeItem.bind(this)}></NewLinkItem>):
                (<FakeNewLinkItem placeholder='Add new code link' newItem={addCodeLinkClick}/>)}
            </Col>
            <Col>
                {newDataList.map((dataLink, index) => {
                    return <OldLinkItem addrLink={dataLink} onRemove={() => delDataLink(index)} />;
                })}
                {(showEmptyData||newDataList.length == 0)?
                (<NewLinkItem sendValueToFa={getDataItem.bind(this)}></NewLinkItem>):
                (<FakeNewLinkItem placeholder='Add new data link' newItem={addDataLinkClick}/>)}
            </Col>
            <Col>
                <Button onClick={props.onFinish?(() => {props.onFinish(newCodeList, newDataList)}) : addRCDClick}>
                    <GoCheck/>
                </Button>
            </Col>
        </React.Fragment>
    )
}

export default EmptyRCDOverView;
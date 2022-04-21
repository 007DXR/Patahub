import React from 'react';
import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import GithubRepoInfo from "../Utilities/GithubRepoInfo/GithubRepoInfo.js"
import "./RCDOverView.css";
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { GoX, GoPlus, GoCheck } from 'react-icons/go';

function NewLinkItem(props){
    const [newAddr, setNewAddr] = useState("");

    const saveBtn = () => {
        if(newAddr!==""){
            props.onAdd(newAddr);
            setNewAddr("");
        }
    }
    return (
        <div>
            <input type="text" value={newAddr} 
            onChange={event => setNewAddr(event.target.value)}></input>
            <Button onClick={saveBtn} className="btn-sm"><GoCheck/></Button>
        </div>
    );
}

function OldLinkItem(props){
    const [newAddr, setNewAddr] = useState(props.addrLink);

    useEffect( () => {
        setNewAddr(props.addrLink)
    }, [props.addrLink])

    const delLink = () => {
        props.onRemove();
    }
    const editLink = () => {
        if(newAddr === props.addrLink){
            return; //未修改过
        }
        props.onEdit(newAddr);
    }
    
    return (
        <div>
            <input type="text" value={newAddr}
            onChange={event => setNewAddr(event.target.value)}></input>
            <Button onClick={editLink} className="btn-sm"><GoCheck/></Button>
            <Button onClick={delLink} className="btn-sm btn-danger"><BsFillTrashFill/></Button>
        </div>
    );
}

function RCDOverView(props){
    const [isEditting, setIsEditting] = useState(false);
    const [newCodeList, setNewCodeList] = useState(props.RCD.codeLinks);
    const [newDataList, setNewDataList] = useState(props.RCD.datasetLinks);
    const [showEmptyCode, setShowEmptyCode] = useState(false);
    const [showEmptyData, setShowEmptyData] = useState(false);
    
    const delRCD = () => {
        props.onRemove();
        setIsEditting(false);
    }

    const addCodeLink = newCodeLink => {
        setNewCodeList([...newCodeList, newCodeLink]);
        setShowEmptyCode(false);
    }
    const addDataLink = newDataLink => {
        setNewDataList([...newDataList, newDataLink]);
        setShowEmptyData(false);
    }
    
    const delCodeLink = index => {
        setNewCodeList([...newCodeList.slice(0, index), ...newCodeList.slice(index + 1)]);
    }
    const delDataLink = index => {
        setNewDataList([...newDataList.slice(0, index), ...newDataList.slice(index + 1)]);
    }

    const editCodeLink = (codeLink, index) => {
        setNewCodeList([...newCodeList.slice(0, index), 
            codeLink,
            , ...newCodeList.slice(index + 1)].flat())  //use flat() to remove empty slots
        
        setShowEmptyCode(false);
    }
    const editDataLink = (dataLink, index) => {
        setNewDataList([...newDataList.slice(0, index), 
            dataLink,
            , ...newDataList.slice(index + 1)].flat())  //use flat() to remove empty slots
        
        setShowEmptyData(false);
    }

    const addCodeLinkClick = () => {
        setShowEmptyCode(true);
    }
    const addDataLinkClick = () => {
        setShowEmptyData(true);
    }
    
    return (
        <Row className="RCDOverView">
            <Col>
                <Link to={`/RCDInfo/${props.repoName}/${props.RCD.resultId}`}>
                    <Image src={props.RCD.resultImage} style={{height: '50px'}} />
                </Link> 
            </Col>
            <Col>
                {!isEditting?(
                    newCodeList.map((codeLink) => 
                    <div>
                        <GithubRepoInfo link={codeLink}>somecode</GithubRepoInfo>
                    </div>)):(
                    <div>
                        {newCodeList.map((codeLink, index) => {
                            // console.log("newcodelist", codeLink,index)
                            return <OldLinkItem addrLink={codeLink} onRemove={() => delCodeLink(index)} 
                            onEdit={newAddr => editCodeLink(newAddr, index)}/>;
                        })}
                        {(showEmptyCode||newCodeList.length == 0)?<NewLinkItem onAdd={newAddr=>addCodeLink(newAddr)}></NewLinkItem>:""}
                        <Button onClick={addCodeLinkClick} className="bs-cyan"><GoPlus/></Button>
                    </div>)}
            </Col>
            <Col>
                {!isEditting?(
                    newDataList.map((datasetLink) => <div>
                        <GithubRepoInfo link={datasetLink}>somedata</GithubRepoInfo><br />
                    </div>)):(
                    <div>
                        {newDataList.map((dataLink, index) => {
                            return <OldLinkItem addrLink={dataLink} onRemove={() => delDataLink(index)} 
                            onEdit={newAddr => editDataLink(newAddr, index)}/>;
                        })}
                        {(showEmptyData||newDataList.length == 0)?<NewLinkItem onAdd={newAddr=>addDataLink(newAddr)}></NewLinkItem>:""}
                        <Button onClick={addDataLinkClick} className="bs-cyan"><GoPlus/></Button>
                    </div>
                )}
            </Col>
            <Col>
                {
                    !isEditting?(<Button onClick={() => setIsEditting(true)}>edit link</Button>):
                        (<Button onClick={() => setIsEditting(false)}>finish edit</Button>)
                }
                <Button onClick={delRCD} className="btn-sm btn-danger"><BsFillTrashFill/></Button>
            </Col>
        </Row>
    )
}
export default RCDOverView;

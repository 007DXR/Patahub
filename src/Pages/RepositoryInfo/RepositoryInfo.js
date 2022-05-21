import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { getRCDList } from '../../Data/demo.js'
import { Card, Container, Row, Button, Col } from 'react-bootstrap';
// import EmptyRCDOverView from './EmptyRCDOverView.js';
import { CreateRCD, DelRCD, getPaperById, getRCDByRepoID, getRCDByRepoName, getResultLink } from '../../Data/rcd.js';
import PostRCDForm from './PostRCD.js';
import { GoPlus } from 'react-icons/go';

function RepositoryInfo(props) {
    const repoId = useParams().repoName;
    const userId = 1;
    const [paperInfo, setPaperInfo] = useState({});
    const [RCDList, setRCDList] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingRCD, setEditingRCD] = useState({});

    useEffect(() => {
        getPaperById(repoId).then((data, err) => {
            if (err) throw err;
            setPaperInfo(data);
        });
    }, []);

    useEffect(() => {
        getRCDByRepoID(parseInt(repoId)).then(async (data, err) => {
            setRCDList(data);
            setIsDeleting(false);
        });
    }, [isCreating, isEditing, isDeleting]);

    const delRCD = rcdID => {
        const res = DelRCD(userId, rcdID);
        setIsDeleting(true);
        if (res) window.location.reload();
    }
    const hideForm = () => {
        if (isCreating) {
            setIsCreating(false);
            //window.location.reload();
        }
        if (isEditing) {
            setIsEditing(false);
            setEditingRCD({});
            //window.location.reload();
        }
    }

    return (
        <Container className='pt-5'>
            <p class="fs-1 text-start">{paperInfo.paper_name}</p>
            <div class="text-start">Link: <a  href={paperInfo.paper_link}>{paperInfo.paper_link}</a></div>
            <p class="text-start">Abstract: {paperInfo.paper_abstract}</p>
            {/* <p class="text-start"style={{textAlign:'left'}}>{paperInfo.paper_link}</p> */}
            <p class="text-start">Docker: {paperInfo.docker_link}</p>
            {/* <>{paperInfo.codeset}</> */}
            {RCDList.length>0?(
                <Row className="mt-5">
                    <Col>Result</Col>
                    {/* <Col>Code</Col> */}
                    <Col>Data</Col>
                    <Col>Makefile</Col>
                    <Col></Col>
                </Row>):""
            }
            {
                RCDList.map((RCD) => <Card className="m-3 p-3"><RCDOverView repoName={repoId} RCD={RCD} needEdit={true}
                    onRemove={(rcdID) => delRCD(rcdID)} onEdit={(RCD) => { setIsEditing(true); setEditingRCD(RCD) }} /></Card>)
            }
            {/* <Row><EmptyRCDOverView sendValueToFa={getRCDItem.bind(this)}/></Row> */}
            <Button onClick={() => setIsCreating(true)}><GoPlus /></Button>
            <PostRCDForm onCreate={isCreating} onEdit={isEditing} RCD={editingRCD} onHide={hideForm} fixedPaperID={repoId} userID={userId}></PostRCDForm>
        </Container >
    )
}
export default RepositoryInfo;
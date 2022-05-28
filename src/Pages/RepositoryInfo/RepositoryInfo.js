import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { Card, Container, Row, Button, Col } from 'react-bootstrap';
// import EmptyRCDOverView from './EmptyRCDOverView.js';
import { CreateRCD, DelRCD, getPaperById, getRCDByRepoID, getRCDByRepoName, getResultLink } from '../../Data/rcd.js';
import PostRCDForm from './PostRCD.js';
import { GoPlus } from 'react-icons/go';
import DeleteRepoButton from './DeleteRepo.js';
import { UserInfo } from '../Utilities/auth.js';
import { UpdateRepoButton } from '../AllRepositories/CreateRepo.js';
import Stack from 'react-bootstrap/Stack'

function RepositoryInfo(props) {
    const repoId = useParams().repoName;

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
        DelRCD(UserInfo.token, rcdID).then((data, err) => {
            if (data) window.location.reload();
            else alert(err);
        });
        setIsDeleting(true);
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
        <Container className='pt-5 pb-5'>
            <div className='mb-5 text-start'>
                <p class='fs-1'>{paperInfo.paper_name}</p>
                <p >{paperInfo.paper_abstract}</p>
                <Stack direction="horizontal" gap={3}>
                    <Button variant="outline-primary" href={paperInfo.paper_link}>Paper</Button>
                    <Button variant="outline-primary" href={paperInfo.codeset_link}>Code</Button>
                    <Button variant="outline-primary" href={paperInfo.docker_link}>Docker</Button>
                </Stack>
            </div>
            <div className='mb-3 text-start'>
                <p class="fs-4">RCD List</p>
            </div>
            <hr />
            {RCDList.length > 0 ? (
                <Row className="mt-3">
                    <Col>Result</Col>
                    {/* <Col>Code</Col> */}
                    <Col>Data</Col>
                    <Col>Makefile</Col>
                    {paperInfo.user_id && paperInfo.user_id == UserInfo.userId ?
                        <Col></Col> : ""
                    }
                </Row>) : ""
            }
            {
                RCDList.map((RCD) => <Card className="m-3 py-3"><RCDOverView repoName={repoId} RCD={RCD}
                    onRemove={(rcdID) => delRCD(rcdID)} onEdit={(RCD) => { setIsEditing(true); setEditingRCD(RCD) }} /></Card>)
            }
            {/* <Row><EmptyRCDOverView sendValueToFa={getRCDItem.bind(this)}/></Row> */}
            {paperInfo.user_id && paperInfo.user_id == UserInfo.userId ?
                <React.Fragment>
                    <Button onClick={() => setIsCreating(true)}>Add New RCD</Button>
                    <UpdateRepoButton paper_id={paperInfo.paper_id} />
                    <DeleteRepoButton paper_id={paperInfo.paper_id} />
                </React.Fragment>
                : null}
            <PostRCDForm onCreate={isCreating} onEdit={isEditing} RCD={editingRCD} onHide={hideForm} fixedPaperID={repoId}></PostRCDForm>
        </Container >
    )
}
export default RepositoryInfo;
import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { getRCDList } from '../../Data/demo.js'
import { Card, Container, Row, Button, Col } from 'react-bootstrap';
// import EmptyRCDOverView from './EmptyRCDOverView.js';
import { CreateRCD, DelRCD, getRCDByRepoID, getRCDByRepoName, getResultLink } from '../../Data/rcd.js';
import PostRCDForm from './PostRCD.js';
import { GoPlus } from 'react-icons/go';

function RepositoryInfo(props) {
    const repoId = useParams().repoName;
    const [RCDList, setRCDList] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingRCD, setEditingRCD] = useState({});

    useEffect(() => {
        getRCDByRepoID(parseInt(repoId)).then(async (data, err) => {
            console.log(data);
            data = data.map(async (RCD) => {
                let resultImage;
                await getResultLink(RCD.result_id).then((data, err) => {
                    if (err) throw err;
                    resultImage = data;
                });
                return {
                    paperId: RCD.paper_id,
                    resultId: RCD.result_id,
                    resultImage,
                    codesetId: RCD.codeset_id,
                    datasetId: RCD.dataset_id,
                    codeLink: RCD.code_link,
                    dataLink: RCD.data_link,
                    rcdId: RCD.rcd_id
                };
            })
            await Promise.all(data).then((newData) => { data = newData; });
            console.log("rcd list?", data)
            setRCDList(data);
            setIsDeleting(false);
        });
    }, [isCreating, isEditing, isDeleting]);

    const delRCD = rcdID => {
        const res = DelRCD(rcdID);
        setIsDeleting(true);
        window.location.reload();
    }
    const hideForm = () => {
        if (isCreating) {
            setIsCreating(false);
            window.location.reload();
        }
        if (isEditing) {
            setIsEditing(false);
            setEditingRCD({});
            window.location.reload();
        }
    }

    return (
        <Container className='pt-5'>
            <Row>
                <Col>Result</Col>
                <Col>Code</Col>
                <Col>Data</Col>
                <Col></Col>
            </Row>
            {
                RCDList.map((RCD) => <Card className="m-3 p-3"><RCDOverView repoName={repoId} RCD={RCD}
                    onRemove={(rcdID) => delRCD(rcdID)} onEdit={(RCD) => { setIsEditing(true); setEditingRCD(RCD) }} /></Card>)
            }
            {/* <Row><EmptyRCDOverView sendValueToFa={getRCDItem.bind(this)}/></Row> */}
            <Button onClick={() => setIsCreating(true)}><GoPlus /></Button>
            <PostRCDForm onCreate={isCreating} onEdit={isEditing} RCD={editingRCD} onHide={hideForm} fixedPaperID={repoId} userID={1}></PostRCDForm>
        </Container >
    )
}
export default RepositoryInfo;
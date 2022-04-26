import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCDOverView from './RCDOverView.js'
import { getRCDList } from '../../Data/demo.js'
import { Card, Container, Row, Button } from 'react-bootstrap';
// import EmptyRCDOverView from './EmptyRCDOverView.js';
import { CreateRCD, DelRCD, getRCDByRepoID, getRCDByRepoName, getResultLink } from '../../Data/rcd.js';
import PostRCDForm from './PostRCD.js';

function RepositoryInfo(props){
    const repoId = useParams().repoName;
    const [RCDList, setRCDList] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingRCD, setEditingRCD] = useState({});

    useEffect( () => {
        console.log("paper id", repoId, typeof(repoId), typeof(parseInt(repoId)))
        getRCDByRepoID(parseInt(repoId)).then((data, err) => {
            console.log("data",data, typeof(data));
            data = data.map((RCD)=>{
                const res = getResultLink(RCD.result_id);

                return {
                    paperId: RCD.paper_id,
                    resultId: RCD.result_id,
                    resultImage: res,
                    codesetId: RCD.codeset_id,
                    datasetId: RCD.dataset_id,
                    codeLink: RCD.code_link,
                    dataLink: RCD.data_link,
                    rcdId: RCD.rcd_id
                };
            })
            setRCDList(data);
            setIsDeleting(false);
            console.log("data2",data, typeof(data));
        });
    } ,[isCreating, isEditing, isDeleting]);
    //     getRCDList(repoId).then((data, err) => {
    //         console.log("data", data)
    //         setRCDList(data);
    //     });
    // } ,[]);

    const delRCD = rcdID => {
        const res = DelRCD(rcdID);
        setIsDeleting(true);
    }
    const hideForm = () => {
        if(isCreating){
            setIsCreating(false);
        }
        if(isEditing){
            setIsEditing(false);
            setEditingRCD({});
        }
    }

    return (
        <Container className='pt-5'>
            {
                RCDList.map((RCD) => <Card className="m-3 p-3"><RCDOverView repoName={repoId} RCD={RCD}
                onRemove={(rcdID) => delRCD(rcdID)} onEdit={(RCD)=>{setIsEditing(true);setEditingRCD(RCD)}}/></Card>)
            }
            {/* <Row><EmptyRCDOverView sendValueToFa={getRCDItem.bind(this)}/></Row> */}
            <Button onClick={() => setIsCreating(true)}>add</Button>
            <PostRCDForm onCreate={isCreating} onEdit={isEditing} RCD={editingRCD} onHide={hideForm} fixedPaperID={repoId}></PostRCDForm>
        </Container>
    )
}
export default RepositoryInfo;
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button, Table, Card } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";
import { getAllDatasetByUser, DeleteDataset } from '../../Data/dataset';
import './scroll.css';
import CreateDatasetForm from '../RepositoryInfo/CreateDataset';
import EditDatasetForm from '../RepositoryInfo/EditDataset';
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { UserAvatar } from '../../User.js'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { UserInfo } from '../Utilities/auth';

function DatasetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editDataset = () => {
        if(props.edit){
            props.onEdit();
            setShowEdit(true);
        }
    };

    return (
        <>
            <Card className="mt-3" onClick={editDataset}>
                <Card.Title>{props.dataset.dataset_name}</Card.Title>
                <Card.Body>
                    <p>
                    {props.dataset.dataset_link}
                    </p>
                    { props.edit ? <Button onClick={function (event) {
                        event.stopPropagation()
                        console.log(props.dataset.dataset)
                        DeleteDataset(UserInfo.token, props.dataset.dataset_id).then((data, err) => {
                            if(data)window.location.reload();
                            else alert(err);
                        });
                    }} className="btn-sm btn-danger"> <BsFillTrashFill /></Button>
                    : null}
                </Card.Body> 
                
            </Card>
        </>
    )
}

function DatasetCardList(props) {
    const [datasetList, setDatasetList] = useState([]);
    const [datasetCreating, setDatasetCreating] = useState(false);
    const [datasetEditing, setDatasetEditing] = useState(false);
    const [editingDataset, setEditingDataset] = useState({});
    useEffect(() => {
        getAllDatasetByUser().then((data, err) => {
            setDatasetList(data);
        })
    }, []);
    return (
        <React.Fragment>
            {datasetList.map((dataset) => <DatasetCard dataset={dataset} userID={props.userID} edit={props.edit}
                onEdit={() => { setDatasetEditing(true); setEditingDataset(dataset) }}> </DatasetCard>
            )}
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm>
            <EditDatasetForm show={datasetEditing} onHide={() => setDatasetEditing(false)} dataset={editingDataset}></EditDatasetForm>
        </React.Fragment>
    )
}

function UserProfile(props) {
    return (
        <Container className='mt-5'>
            <Row className='h4'>{props.userName}'s homepage</Row>
        </Container>
    )
}

function UserOverview(props) {
    return (
        <Tabs defaultActiveKey="Datasets" className="mb-3">
            <Tab eventKey="Datasets" title="Datasets">
                <DatasetCardList edit={props.edit}/>
            </Tab>
        </Tabs>
    )
}

function UserHomepage(props) {
    const userName = useParams().userName;
    return (
        <Container className='mt-2'>
            <Row>
                <Col xs={4}><UserProfile userName={userName}/></Col>
                <Col xs={8}><UserOverview edit={String(userName) == String(UserInfo.userName)}/></Col>
            </Row>
        </Container>
    )
}

export default UserHomepage;
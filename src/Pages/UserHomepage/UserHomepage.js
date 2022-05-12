import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button, Table, Card } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";
import { getAllCodesetByUser, DeleteCodeset } from '../../Data/codeset';
import { getAllDatasetByUser, DeleteDataset } from '../../Data/dataset';
import './scroll.css';
import CreateCodesetForm from '../RepositoryInfo/CreateCodeset';
import CreateDatasetForm from '../RepositoryInfo/CreateDataset';
import EditCodesetForm from '../RepositoryInfo/EditCodeset';
import EditDatasetForm from '../RepositoryInfo/EditDataset';
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { UserAvatar } from '../../User.js'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

function CodesetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editCodeset = () => {
        props.onEdit();
        setShowEdit(true);
    };

    return (
        <>
            <Card className="mt-3" onClick={editCodeset}>
                <Card.Title>{props.codeset.codeset_name}</Card.Title>
                <Card.Body>
                    {props.codeset.codeset_link}
                    <p />
                    <Button onClick={function (event) {
                        event.stopPropagation()
                        console.log(props.codeset.codeset_id)
                        const res = DeleteCodeset(props.codeset.codeset_id)
                        if (res) window.location.reload();
                    }} className="btn-sm btn-danger"><BsFillTrashFill /></Button>
                </Card.Body>
            </Card>
        </>
    )
}

function CodesetCardList(props) {
    const [codesetList, setCodesetList] = useState([]);
    const [codesetCreating, setCodesetCreating] = useState(false);
    const [codesetEditing, setCodesetEditing] = useState(false);
    const [editingCodeset, setEditingCodeset] = useState({});
    useEffect(() => {
        getAllCodesetByUser(props.userID).then((data, err) => {
            setCodesetList(data);
        })
    }, []);
    return (
        <React.Fragment>
            {codesetList.map((codeset) => <CodesetCard codeset={codeset}
                onEdit={() => { setCodesetEditing(true); setEditingCodeset(codeset) }}></CodesetCard>
            )}
            <CreateCodesetForm show={codesetCreating} onHide={() => setCodesetCreating(false)}></CreateCodesetForm>
            <EditCodesetForm show={codesetEditing} onHide={() => setCodesetEditing(false)} codeset={editingCodeset}></EditCodesetForm>
        </React.Fragment>
    )
}

function DatasetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editDataset = () => {
        props.onEdit();
        setShowEdit(true);
    };

    return (
        <>
            <Card className="mt-3" onClick={editDataset}>
                <Card.Title>{props.dataset.dataset_name}</Card.Title>
                <Card.Body>
                    {props.dataset.dataset_link}
                    <p />
                    <Button onClick={function (event) {
                        event.stopPropagation()
                        console.log(props.dataset.dataset)
                        const res = DeleteDataset(props.dataset.dataset_id)
                        if (res) window.location.reload();
                    }} className="btn-sm btn-danger"> <BsFillTrashFill /></Button>
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
        getAllDatasetByUser(props.userID).then((data, err) => {
            setDatasetList(data);
        })
    }, []);
    return (
        <React.Fragment>
            {datasetList.map((dataset) => <DatasetCard dataset={dataset}
                onEdit={() => { setDatasetEditing(true); setEditingDataset(dataset) }}></DatasetCard>
            )}
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm>
            <EditDatasetForm show={datasetEditing} onHide={() => setDatasetEditing(false)} dataset={editingDataset}></EditDatasetForm>
        </React.Fragment>
    )
}

function UserProfile(props) {
    return (
        <UserAvatar userName="user"></UserAvatar>
    )
}

function UserOverview(props) {
    return (
        <Tabs defaultActiveKey="Codesets" className="mb-3">
            <Tab eventKey="Codesets" title="Codesets">
                <CodesetCardList userID={props.userID} />
            </Tab>
            <Tab eventKey="Datasets" title="Datasets">
                <DatasetCardList userID={props.userID} />
            </Tab>
        </Tabs>
    )
}

function UserHomepage(props) {
    const userName = useParams().userName;
    const userID = 1;

    return (
        <Container>
            <Row>
                <Col xs={4}><UserProfile /></Col>
                <Col xs={8}><UserOverview userID={userID} /></Col>
            </Row>
        </Container>
    )
}

export default UserHomepage;
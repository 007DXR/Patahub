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

function CodesetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editCodeset = () => {
        props.onEdit();
        setShowEdit(true);
    };

    return (
        <>
            <Card className="scrollcard" onClick={editCodeset}>
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

function DatasetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editDataset = () => {
        props.onEdit();
        setShowEdit(true);
    };

    return (
        <>
            <Card className="scrollcard" onClick={editDataset}>
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

function UserHomepage(props) {
    const userName = useParams().userName;
    const userID = 1;
    const [datasetList, setDatasetList] = useState([]);
    const [codesetList, setCodesetList] = useState([]);
    const [codesetCreating, setCodesetCreating] = useState(false);
    const [codesetEditing, setCodesetEditing] = useState(false);
    const [datasetCreating, setDatasetCreating] = useState(false);
    const [datasetEditing, setDatasetEditing] = useState(false);
    const [editingCodeset, setEditingCodeset] = useState({});
    const [editingDataset, setEditingDataset] = useState({});

    useEffect(() => {
        getAllCodesetByUser(userID).then((data, err) => {
            setCodesetList(data);
        })
        getAllDatasetByUser(userID).then((data, err) => {
            setDatasetList(data);
        })
    }, []);

    return (
        <>
            <div>Codesets</div>
            <div className="scrollmenu">
                {
                    codesetList.map((codeset) => <CodesetCard codeset={codeset}
                        onEdit={() => { setCodesetEditing(true); setEditingCodeset(codeset) }}></CodesetCard>
                    )
                }
            </div>
            <div>Datasets</div>
            <div className="scrollmenu">
                {
                    datasetList.map((dataset) => <DatasetCard dataset={dataset}
                        onEdit={() => { setDatasetEditing(true); setEditingDataset(dataset) }}></DatasetCard>
                    )
                }
            </div>

            <CreateCodesetForm show={codesetCreating} onHide={() => setCodesetCreating(false)}></CreateCodesetForm>
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm>
            <EditCodesetForm show={codesetEditing} onHide={() => setCodesetEditing(false)} codeset={editingCodeset}></EditCodesetForm>
            <EditDatasetForm show={datasetEditing} onHide={() => setDatasetEditing(false)} dataset={editingDataset}></EditDatasetForm>
        </>
    )
}

export default UserHomepage;
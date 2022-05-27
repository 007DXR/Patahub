import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button, Table, Card, Form, Modal } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";
import { DeleteDataset, getMyDatasets } from '../../Data/dataset';
import './scroll.css';
import CreateDatasetForm from '../RepositoryInfo/CreateDataset';
import EditDatasetForm from '../RepositoryInfo/EditDataset';
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { UserAvatar } from '../../User.js'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { UserInfo } from '../Utilities/auth';
import { getMyRepositories } from '../../Data/link';
import RepoOverView from '../AllRepositories/RepoOverView';
import SimpleForm from '../Utilities/SimpleForm';
import { updateUser } from '../../Data/User';
import { HiOutlineMail } from 'react-icons/hi'

function DatasetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editDataset = () => {
        if(props.dataset.user_id && props.dataset.user_id == UserInfo.userId){
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
                    { props.dataset.user_id && props.dataset.user_id == UserInfo.userId ? 
                        <Button onClick={function (event) {
                        event.stopPropagation()
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

function PaperCardList(props) {
    const [paperList, setPaperList] = useState([]);
    useEffect(() => {
        if(UserInfo.userName)
        getMyRepositories(UserInfo.token).then((data, err) => {
            setPaperList(data);
        })
    }, [UserInfo]);
    return paperList.map((paper) => <RepoOverView repoInfo={paper}/>)
}

function DatasetCardList(props) {
    const [datasetList, setDatasetList] = useState([]);
    const [datasetCreating, setDatasetCreating] = useState(false);
    const [datasetEditing, setDatasetEditing] = useState(false);
    const [editingDataset, setEditingDataset] = useState({});
    useEffect(() => {
        if(UserInfo.userName)
        getMyDatasets(UserInfo.token).then((data, err) => {
            setDatasetList(data);
        })
    }, [UserInfo]);
    return (
        <React.Fragment>
            {datasetList.map((dataset) => <DatasetCard dataset={dataset}
                onEdit={() => {setDatasetEditing(true); setEditingDataset(dataset) }}> </DatasetCard>
            )}
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm>
            <EditDatasetForm show={datasetEditing} onHide={() => setDatasetEditing(false)} dataset={editingDataset}></EditDatasetForm>
        </React.Fragment>
    )
}

function UserModifyInfo(props){
    let [myUserInfo, setMyUserInfo] = useState({});
    let [onEdit, setOnEdit] = useState(false);
    useEffect(() => {
        if(UserInfo.userName)setMyUserInfo({
            user_name: UserInfo.userName,
            user_email: UserInfo.userEmail,
            user_password: '',
        });
    }, [UserInfo]);

    function handleSubmit(event){
        event.preventDefault();
        updateUser(UserInfo.token, myUserInfo.user_name, myUserInfo.user_email, myUserInfo.user_password, UserInfo.userId).then((data, err) => {
            if(data) window.location.refresh();
            else alert(err);
        });
    }
    
    return (
        <React.Fragment>
            <Button onClick={() => {setOnEdit(true)}} className='btn-sm mt-2'>update my profile</Button>
            <Modal show={onEdit} onHide={() => {setOnEdit(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>修改个人信息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <SimpleForm keys={['user_name', 'user_email', {key: 'user_password', type:'password'}]} value={myUserInfo} setValue={setMyUserInfo}/>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

function UserProfile(props) {
    return (
        <Container className='mt-5'>
            <Row className='h4'>{props.userName}'s homepage</Row>
            <HiOutlineMail /> {UserInfo.userEmail}
            <br/>
            {
                props.userName == UserInfo.userName ? 
                    <UserModifyInfo />
                : null
            }

        </Container>
    )
}

function UserOverview(props) {
    return (
        <Tabs defaultActiveKey="Datasets" className="mb-3">
            <Tab eventKey="Papers" title="Papers">
                <PaperCardList/>
            </Tab>
            <Tab eventKey="Datasets" title="Datasets">
                <DatasetCardList/>
            </Tab>
        </Tabs>
    )
}

function UserHomepage(props) {
    const userName = useParams().userName;
    return (
        userName == UserInfo.userName ? 
        <Container className='mt-2'>
            <Row>
                <Col xs={4}><UserProfile userName={userName}/></Col>
                <Col xs={8}><UserOverview/></Col>
            </Row>
        </Container>
        : null
    )
}

export default UserHomepage;
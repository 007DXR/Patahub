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
import { getDatasetsByUserId, getMyRepositories, getRepositoriesByUserId, getResultsByUserId } from '../../Data/link';
import RepoOverView from '../AllRepositories/RepoOverView';
import SimpleForm from '../Utilities/SimpleForm';
import { getInfoByUserId, updateUser } from '../../Data/User';
import { HiOutlineMail } from 'react-icons/hi'
import CreateResultForm from '../RepositoryInfo/CreateResult';
import { DeleteResult } from '../../Data/result';
import EditResultForm from '../RepositoryInfo/EditResult';

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
            <Card className="mt-3 pt-3" onClick={editDataset}>
                <Card.Title>{props.dataset.dataset_name}</Card.Title>
                <Card.Body>
                    <p>
                    {props.dataset.dataset_link}
                    </p>
                    { props.edit ? 
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
    const [paperList, setPaperList] = useState(null);
    useEffect(() => {
        // if(UserInfo.userName)
        getRepositoriesByUserId(props.userId).then((data, err) => {
            setPaperList(data);
        })
    }, [UserInfo]);
    return (paperList && paperList.length>0 ? 
        paperList.map((paper) => <RepoOverView repoInfo={paper}/>)
    : Object.is(paperList, null) ? null
    : 'This user does not have any papers yet :(')
}

function DatasetCardList(props) {
    const [datasetList, setDatasetList] = useState(null);
    const [datasetCreating, setDatasetCreating] = useState(false);
    const [datasetEditing, setDatasetEditing] = useState(false);
    const [editingDataset, setEditingDataset] = useState({});
    useEffect(() => {
        // if(UserInfo.userName)
        getDatasetsByUserId(props.userId).then((data, err) => {
            setDatasetList(data);
        })
    }, [UserInfo]);
    return (
        datasetList && datasetList.length>0 ? 
        <React.Fragment>
            {datasetList.map((dataset) => <DatasetCard dataset={dataset} edit={props.edit}
                onEdit={() => {setDatasetEditing(true); setEditingDataset(dataset) }}> </DatasetCard>
            )}
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm>
            <EditDatasetForm show={datasetEditing} onHide={() => setDatasetEditing(false)} dataset={editingDataset}></EditDatasetForm>
        </React.Fragment>
        : Object.is(datasetList, null) ? null
        : 'This user does not have any datasets yet :('
    )
}



function ResultCardList(props) {
    const [resultList, setResultList] = useState(null);
    const [resultCreating, setResultCreating] = useState(false);
    const [resultEditing, setResultEditing] = useState(false);
    const [editingResult, setEditingResult] = useState({});
    useEffect(() => {
        // if(UserInfo.userName)
        getResultsByUserId(props.userId).then((data, err) => {
            setResultList(data);
        })
    }, [UserInfo]);
    return (
        resultList && resultList.length>0 ? 
        <React.Fragment>
            {resultList.map((result) => <ResultCard result={result} edit={props.edit}
                onEdit={() => {setResultEditing(true); setEditingResult(result) }}> </ResultCard>
            )}
            <CreateResultForm show={resultCreating} onHide={() => setResultCreating(false)}></CreateResultForm>
            <EditResultForm show={resultEditing} onHide={() => setResultEditing(false)} result={editingResult}></EditResultForm>
        </React.Fragment>
        : Object.is(resultList, null) ? null
        : 'This user does not have any results yet :('
    )
}

function ResultCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editResult = () => {
        if(props.result.user_id && props.result.user_id == UserInfo.userId){
            props.onEdit();
            setShowEdit(true);
        }
    };

    return (
        <>
            <Card className="mt-3 pt-3" onClick={editResult}>
                <Card.Title>{props.result.result_name}</Card.Title>
                <Card.Body>
                    <p>
                    value: {props.result.result_value}
                    <br/>
                    description: {props.result.result_description}
                    </p>
                    { props.edit ? 
                        <Button onClick={function (event) {
                        event.stopPropagation()
                        DeleteResult(UserInfo.token, props.result.result_id).then((data, err) => {
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

function UserModifyInfo(props){
    let [myUserInfo, setMyUserInfo] = useState({});
    let [onEdit, setOnEdit] = useState(false);
    useEffect(() => {
        if(UserInfo.userName)setMyUserInfo({
            user_name: UserInfo.userName,
            user_email: UserInfo.userEmail,
            old_password: '',
            new_password: '',
        });
    }, [UserInfo]);

    function handleSubmit(event){
        event.preventDefault();
        updateUser(UserInfo.token, myUserInfo.user_name, myUserInfo.user_email, myUserInfo.old_password, myUserInfo.new_password, UserInfo.userId).then((data, err) => {
            if(data){
                window.localStorage.setItem('UserInfo', '');
                window.location.replace('/');
            }else alert(err);
        }, error=>{alert(error.responseJSON.detail)});
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
                        <SimpleForm keys={[{key: 'user_name', content: 'Name'},
                                        {key: 'user_email', content: 'Email'},
                                        {key: 'old_password', type:'password', content: 'Old password'}, 
                                        {key: 'new_password', type:'password', content: 'New password'}]}
                            value={myUserInfo} setValue={setMyUserInfo}/>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

function UserProfile(props) {
    return (
        props.info.user_name ? 
        <Container className='mt-5'>
            <Row className='h4'>{props.info.user_name}'s homepage</Row>
            <HiOutlineMail /> {props.info.user_email}
            <br/>
            {
                props.edit ? 
                    <UserModifyInfo />
                : null
            }

        </Container>
        : 'Loading...'
    )
}

function UserOverview(props) {
    return (
        <Tabs defaultActiveKey="Papers" className="mb-3">
            <Tab eventKey="Papers" title="Papers">
                <PaperCardList userId={props.userId} edit={props.edit} info={props.info}/>
            </Tab>
            <Tab eventKey="Datasets" title="Datasets">
                <DatasetCardList userId={props.userId} edit={props.edit} info={props.info}/>
            </Tab>
            <Tab eventKey="Results" title="Results">
                <ResultCardList userId={props.userId} edit={props.edit} info={props.info}/>
            </Tab>
        </Tabs>
    )
}

function UserHomepage(props) {
    const userId = useParams().userId;
    const [info , setInfo] = useState({});
    const [edit , setEdit] = useState(false);
    useEffect(() => {
        if(userId)getInfoByUserId(userId).then((data) => {
            setInfo(data);
        }).catch(err => window.location.replace('/'))
    }, [userId]);
    useEffect(() => {
        setEdit(userId == UserInfo.userId);
    }, [UserInfo]);
    return (
        <Container className='mt-2'>
            <Row>
                <Col xs={4}><UserProfile userId={userId} edit={edit} info={info}/></Col>
                <Col xs={8}><UserOverview userId={userId} edit={edit} info={info}/></Col>
            </Row>
        </Container>
    )
}

export default UserHomepage;
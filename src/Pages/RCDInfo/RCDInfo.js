import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchRCD } from '../../Data/rcd.js';
import { Container, Row, Col, Image, Modal, Form } from 'react-bootstrap';
import { CreateResult, getResultListByRCD, CreateResultIntoRCD, getResultByID } from '../../Data/result.js'
import { getGithubRawContent } from '../../Data/github.js';
import { getDatasetLinkByID } from '../../Data/dataset.js';
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import SetInfo from './SetInfo.js';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { BsFillTrashFill } from 'react-icons/bs';
import { RiEditFill } from 'react-icons/ri';
import Badge from 'react-bootstrap/Badge'
import { getPaperById, getRCDByID } from '../../Data/rcd.js';
import { UserInfo } from '../Utilities/auth.js';
import User from '../../User.js';
import SimpleForm from '../Utilities/SimpleForm.js';

function CreateResultForm(props) {
    let [resultInfo, setResultInfo] = useState({});
    let [onEdit, setOnEdit] = useState(false);
    function handleSubmit(event) {
        event.preventDefault();
        CreateResult(UserInfo.token, props.resultName, resultInfo.description, resultInfo.value, props.paperID)
            .then(data => CreateResultIntoRCD(UserInfo.token, props.rcdID, data.result_id))
            .then(data => window.alert('success'))
            .catch(error => window.alert(error.responseJSON.detail))
    }
    return (
        <React.Fragment>
            <Modal show={onEdit} onHide={() => { setOnEdit(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <SimpleForm keys={[{ key: 'description', content: 'Description' },
                        { key: 'value', content: 'Value' }]}
                            value={resultInfo} setValue={setResultInfo} />
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Button onClick={() => setOnEdit(true)}>Create Result</Button>
        </React.Fragment>
    )
}

function RCDInfo(props) {
    let paper_id = useParams().repoName;
    let rcd_id = useParams().RCDId;
    const [paperInfo, setPaperInfo] = useState(null);
    const [RCDInfo, setRCDInfo] = useState(null);
    const [resultList, setResultList] = useState(null);
    useEffect(() => {
        getRCDByID(rcd_id).then(data => getResultByID(data[0].result_id)).then(data => setRCDInfo(data[0]))
    }, [])
    useEffect(() => {
        getPaperById(paper_id).then(data => setPaperInfo(data))
    }, [])
    useEffect(() => {
        getResultListByRCD(rcd_id).then(data => setResultList(data))
    }, [])
    return paperInfo && RCDInfo && resultList ? (
        <Container className='pt-5 pb-5'>
            <div className='mb-5 text-start'>
                <p class='fs-1'>{RCDInfo.result_name}</p>
                <p >
                    这里还可以放一些 RCD 信息
                </p>
            </div>
            <div className='mb-3 text-start'>
                <p class="fs-4">Results</p>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Description</th>
                        <th>Value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        resultList.map((result) =>
                            <tr>
                                <td>
                                    {result.user_name}
                                    {result.user_id == paperInfo.user_id ? <Badge bg="primary">author</Badge> :
                                        UserInfo !== null && result.user_id == UserInfo.userId ? <Badge bg="secondary">you</Badge> :
                                            <React.Fragment />
                                    }
                                </td>
                                <td>{result.result_description}</td>
                                <td>{result.result_value}</td>
                                <td>
                                    {UserInfo !== null && result.user_id == UserInfo.userId ? (
                                        <React.Fragment>
                                            <Button className="btn-sm"><RiEditFill /></Button>
                                            <Button className="btn-sm btn-danger"><BsFillTrashFill /></Button>
                                        </React.Fragment>
                                    ) : <React.Fragment />}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            {console.log('rcdInfo=', RCDInfo)}
            {UserInfo !== null ? <CreateResultForm paperID={paper_id} rcdID={rcd_id} resultName={RCDInfo.result_name} /> : null}
        </Container>
    ) : null
}

export default RCDInfo;
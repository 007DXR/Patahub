import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchRCD } from '../../Data/rcd.js';
import { Container, Row, Col, Image, Modal, Form, Stack } from 'react-bootstrap';
import { CreateResult, getResultListByRCD, CreateResultIntoRCD, getResultByID, DeleteResult } from '../../Data/result.js'
import { getGithubRawContent } from '../../Data/github.js';
import { getDatasetById, getDatasetLinkByID } from '../../Data/dataset.js';
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
import { getRepositorieById, getRepositoryById } from '../../Data/link.js';
import EditResultForm from '../RepositoryInfo/EditResult.js';

function CreateResultForm(props) {
    let [resultInfo, setResultInfo] = useState({});
    let [onEdit, setOnEdit] = useState(false);
    function handleSubmit(event) {
        event.preventDefault();
        CreateResult(UserInfo.token, props.resultName, resultInfo.description, resultInfo.value, props.paperID)
            .then(data => CreateResultIntoRCD(UserInfo.token, props.rcdID, data.result_id))
            .then(data => window.location.reload())
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
    const [datasetInfo, setDatasetInfo] = useState(null);
    const [resultEditingId, setresultEditingId] = useState(null);

    useEffect(() => {
        getRCDByID(rcd_id).then(data => {
            getResultByID(data[0].result_id).then(data => setRCDInfo(data[0]));
            getDatasetById(data[0].dataset_id).then(data => setDatasetInfo(data[0]));
        })
        getPaperById(paper_id).then(data => setPaperInfo(data))
        getResultListByRCD(rcd_id).then(data => setResultList(data))
    }, [])

    let deleteResult = (resultID) => {
        DeleteResult(UserInfo.token, resultID).then(data => {
            window.location.reload();
        }).catch(err => console.log(err));
    }


    return paperInfo && RCDInfo && resultList && datasetInfo ? (
        <Container className='pt-5 pb-5'>
            <div className='mb-5 text-start'>
                <p class='fs-1'>{paperInfo.paper_name}</p>
                <p class='fs-3'>result: {RCDInfo.result_name}</p>

                <Stack direction="horizontal" gap={3}>
                    <Button variant="outline-primary" href={`/repositoryInfo/${paper_id}`}>Paper</Button>
                    <Button variant="outline-primary" href={datasetInfo.dataset_link}>Dataset</Button>
                    <Button variant="outline-primary" href={paperInfo.docker_link}>Docker</Button>
                </Stack>
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
                                    <a href={`/UserHomepage/${result.user_id}`}>{result.user_name}</a>
                                    {result.user_id == paperInfo.user_id ? <Badge bg="primary ms-1">author</Badge> :
                                        UserInfo !== null && result.user_id == UserInfo.userId ? <Badge bg="secondary ms-1">you</Badge> :
                                            <React.Fragment />
                                    }
                                </td>
                                <td>{result.result_description}</td>
                                <td>{result.result_value}</td>
                                <td>
                                    {UserInfo !== null && result.user_id == UserInfo.userId ? (
                                        <React.Fragment>
                                            <Button className="btn-sm" onClick={() => setresultEditingId(result.result_id)}><RiEditFill /></Button>
                                            <Button className="btn-sm btn-danger" onClick={() => deleteResult(result.result_id)}><BsFillTrashFill /></Button>

                                            <EditResultForm show={resultEditingId == result.result_id} onHide={() => setresultEditingId(null)} result={result} fixedName={paperInfo.user_id !== UserInfo.userId} />
                                        </React.Fragment>
                                    ) : <React.Fragment />}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            {UserInfo.userName && RCDInfo && !resultList.find((result) => result.user_id == UserInfo.userId) ?
                <CreateResultForm paperID={paper_id} rcdID={rcd_id} resultName={RCDInfo.result_name} />
                : null}
        </Container>
    ) : null
}

export default RCDInfo;
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { CreateRepo, UpdateRepo } from '../../Data/CreateRepo.js'
import { GoPlus } from 'react-icons/go';
import { FaRegEdit } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import { useParams } from 'react-router-dom';
import { getRepositoryById } from '../../Data/link.js';
import { UserInfo } from '../Utilities/auth.js';
import SimpleForm from '../Utilities/SimpleForm.js';

function CreateRepoFailureAlert(props) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.onFail}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export function CreateRepoButton() {
    return (
        <Button onClick={() => window.location.replace(`/createRepo/`)}>
            <GoPlus />Paper
        </Button>
    )
}


export function UpdateRepoButton(props) {
    return (
        <Button onClick={() => window.location.replace(`/updateRepo/` + props.paper_id)}
            className="ms-2 btn btn-primary h-50 align-self-center">
            Modify This Repository
        </Button>
    )
}


export function CreateRepoForm(props) {
    const paper_id = useParams().paper_id;
    const [validated, setValidated] = useState(false)
    const [paperInfo, setPaperInfo] = useState({});
    const [createRepoFailure, setCreateRepoFailure] = useState(false)
    useEffect(() => {
        if (paper_id) {
            getRepositoryById(paper_id).then((data, err) => {
                setPaperInfo({
                    'paper_name': data[0].paper_name,
                    'paper_link': data[0].paper_link,
                    'paper_abstract': data[0].paper_abstract,
                    'docker_link': data[0].docker_link,
                    'codeset_link': data[0].codeset_link
                });
            })
        }
    }, []);
    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        let valid = form.checkValidity();
        if (!valid) {
            setValidated(true)
            event.stopPropagation();
        }
        else {
            setValidated(false)
            if (props.update) {
                UpdateRepo(UserInfo.token, paper_id, paperInfo).then((data, err) => {
                    if (err) alert(err);
                    else window.location.replace('/repositoryInfo/' + paper_id);
                }, error => { alert(error.responseJSON.detail) })
            } else {
                CreateRepo(UserInfo.token, paperInfo).then((data, err) => {
                    if (err) alert(err);
                    else window.location.replace('/repositoryInfo/' + data.paper_id);
                }, error => { alert(error.responseJSON.detail) })
            }
        }
    };
    return (
        <React.Fragment>
            <Form className="w-50 mx-auto pt-5" noValidate validated={validated} id="formPaperInfo" onSubmit={handleSubmit}>
                {<SimpleForm keys={[{ key: 'paper_name', content: 'Paper name' },
                { key: 'paper_link', content: 'Paper link' },
                { key: 'paper_abstract', content: 'Abstract' },
                { key: 'docker_link', content: 'Docker link' },
                { key: 'codeset_link', content: 'Codeset Link' }]}
                    value={paperInfo} setValue={setPaperInfo} />}
                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                        {props.update ? "Update" : "Create"}
                    </Button>
                </div>
            </Form>
            <CreateRepoFailureAlert show={createRepoFailure} onFail={props.update ? "修改仓库失败" : "创建仓库失败"} onHide={() => setCreateRepoFailure(false)} />
        </React.Fragment>
    )
}   
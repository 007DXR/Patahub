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
import { getRepositorieById } from '../../Data/link.js';

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
            className="bg-transparent border-0 btm-sm ms-2 p-1 btn btn-primary h-50 align-self-center">
            <FaRegEdit color="black"/>
        </Button>
    )
}


export function CreateRepoForm(props) {
    const paper_id = useParams().paper_id;
    const [validated, setValidated] = useState(false)
    const [paperName, setPaperName] = useState(""),
        onPaperNameInput = ({ target: { value } }) => setPaperName(value);
    const [paperLink, setPaperLink] = useState(""),
        onPaperLinkInput = ({ target: { value } }) => setPaperLink(value);
    const [paperAbstract, setPaperAbstract] = useState(""),
        onPaperAbstractInput = ({ target: { value } }) => setPaperAbstract(value);
    const [createRepoFailure, setCreateRepoFailure] = useState(false)
    useEffect(() => {
        if(paper_id){
            getRepositorieById(paper_id).then((data, err) => {
                setPaperName(data[0].paper_name);
                setPaperLink(data[0].paper_link);
                setPaperAbstract(data[0].paper_abstract);
            })
        }
    },[]);
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
            if(props.update){
                UpdateRepo(paper_id, paperName, paperLink, paperAbstract).then((data, err) => {
                    if(err)setCreateRepoFailure(true);
                    else window.location.replace('/repositoryInfo/' + paper_id);
                })
            }else{
                CreateRepo(paperName, paperLink, paperAbstract).then((data, err) => {
                    if(err)setCreateRepoFailure(true);
                    else window.location.replace('/repositoryInfo/' + data.paper_id);
                })
            }
        }
    };
    return (
        <React.Fragment>
            <Form className="w-50 mx-auto pt-5" noValidate validated={validated} id="formPaperInfo" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formPaperName">
                    <Form.Label>Paper Name</Form.Label>
                    <Form.Control type="text" placeholder="Paper Name" maxLength="200" value={paperName} onChange={onPaperNameInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPaperLink">
                    <Form.Label>Paper Link</Form.Label>
                    <Form.Control type="text" placeholder="Paper Link" maxLength="200" value={paperLink} onChange={onPaperLinkInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a link.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPaperAbstract">
                    <Form.Label>Paper Abstract</Form.Label>
                    <Form.Control as="textarea" placeholder="Paper Abstract" maxLength="1000" value={paperAbstract} onChange={onPaperAbstractInput} required />
                    <Form.Control.Feedback type="invalid">
                        Please fill in the paper abstract.
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                        {props.update ? "Update": "Create"}
                    </Button>
                </div>
            </Form>
            <CreateRepoFailureAlert show={createRepoFailure} onFail={props.update ? "修改仓库失败" : "创建仓库失败"} onHide={() => setCreateRepoFailure(false)} />
        </React.Fragment>
    )
}
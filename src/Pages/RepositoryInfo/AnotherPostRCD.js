import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateRCD } from '../../Data/rcd';
import { CreateResult, getResultListByPaper } from '../../Data/result';
import CreateResultForm from './CreateResult';
import CreateCodesetForm from './CreateCodeset';
import { CreateCodeset, getAllCodesetByUser } from '../../Data/codeset';
import { CreateDataset, getAllDatasetByUser } from '../../Data/dataset';
import CreateDatasetForm from './CreateDataset';
import { GoPlus } from 'react-icons/go';
import { splitGithubLink } from '../../Data/github';

function PostRCDForm(props) {
    // console.log("debug", props.RCD.paperId, props.fixedPaperID)
    const [paperID, setPaperID] = useState(props.fixedPaperID ? props.fixedPaperID : null);
    const [resultID, setResultID] = useState(null);
    const [datasetID, setDatasetID] = useState(null);
    const [codesetID, setCodesetID] = useState(null);
    const [dataLink, setDataLink] = useState("");
    const [codeLink, setCodeLink] = useState("");
    const onPaperIDInput = event => setPaperID(event.target.value);
    const onResultIDInput = event => setResultID(event.target.value);
    const onDatasetIDInput = event => setDatasetID(event.target.value);
    const onCodesetIDInput = event => setCodesetID(event.target.value);
    const onDataLinkInput = event => setDataLink(event.target.value);
    const onCodeLinkInput = event => setCodeLink(event.target.value);

    const [resultCreating, setResultCreating] = useState(false);
    const [codesetCreating, setCodesetCreating] = useState(false);
    const [datasetCreating, setDatasetCreating] = useState(false);

    const [resultList, setResultList] = useState([]);
    const [resultName, setResultName] = useState("");

    const [codesetList, setCodesetList] = useState([]);
    const [codesetName, setCodesetName] = useState("");

    const [datasetList, setDatasetList] = useState([]);
    const [datasetName, setDatasetName] = useState("");

    useEffect(() => {
        // setPaperID(props.fixedPaperID?props.RCD.paperId:null);       
        setResultID(props.onEdit ? props.RCD.resultId : null);
        setDatasetID(props.onEdit ? props.RCD.datasetId : null);
        setCodesetID(props.onEdit ? props.RCD.codesetId : null);
        setDataLink(props.onEdit ? props.RCD.dataLink : "");
        setCodeLink(props.onEdit ? props.RCD.codeLink : "");
    }, [props.onEdit])
    // useEffect(()=>{
    //     setPaperID(props.fixedPaperID?props.fixedPaperID:null);
    // },[props.onCreate])

    useEffect(() => {
        setPaperID(props.fixedPaperID ? props.fixedPaperID : null);
        getResultListByPaper(props.fixedPaperID).then((data, err) => {
            setResultList(data);
            console.log("resultlist", data)
        })
        getAllCodesetByUser(props.userID).then((data, err) => {
            setCodesetList(data);
            console.log("codesetlist", data)
        })
        getAllDatasetByUser(props.userID).then((data, err) => {
            setDatasetList(data);
            console.log("datasetlist", data)
        })
    }, [props.onEdit, props.onCreate, resultCreating])

    useEffect(() => {
        if (resultID) {
            const match = resultList.find(result => result.result_id == resultID);
            if (match === undefined)
                setResultName("");
            else
                setResultName(match.result_name);
        } else {
            setResultName("");
        }
    }, [resultID])

    // useEffect(() => {
    //     if (codesetID) {
    //         const match = codesetList.find(codeset => codeset.codeset_id == codesetID);
    //         if (match === undefined)
    //             setCodesetName("");
    //         else
    //             setCodesetName(match.codeset_name);
    //     } else {
    //         setCodesetName("");
    //     }
    // }, [codesetID])

    // useEffect(() => {
    //     if (datasetID) {
    //         const match = datasetList.find(dataset => dataset.dataset_id == datasetID);
    //         if (match === undefined)
    //             setDatasetName("");
    //         else
    //             setDatasetName(match.dataset_name);
    //     } else {
    //         setDatasetName("");
    //     }
    // }, [datasetID])

    async function handleCodeLink(codeLink) {
        console.log("enter handle code link")
        const codesetName = splitGithubLink(codeLink)[1];
        const match = codesetList.find(codeset => codeset.codeset_name == codesetName);
        if (match === undefined) {
            return [true, ""];
        } else {
            return [false, match.codeset_id];
        }
    }
    async function handleDataLink(dataLink) {
        console.log("enter handle data link")
        const datasetName = splitGithubLink(dataLink)[1];
        const match = datasetList.find(dataset => dataset.dataset_name == datasetName);
        if (match === undefined) {
            console.log("not match")
            return [true, ""];
        } else {
            return [false, match.dataset_id];
        }
    }

    function link2SetLink(link) {
        let ownerName, repoName, relLink;
        if (splitGithubLink(link) === "error") {
            alert("invalid link");
        } else {
            [ownerName, repoName, relLink] = splitGithubLink(link);
            console.log("link2", [ownerName, repoName, relLink])
        }
        const setlink = `https://github.com/${ownerName}/${repoName}`;
        relLink = `/${relLink}`;
        return [setlink, relLink, repoName];
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let res;
        let tmp;
        let codeset_id;
        let dataset_id;

        const [codec, codecid] = await handleCodeLink(codeLink);
        const [datac, datacid] = await handleDataLink(dataLink);

        const [codesetLink, code_link, codesetName] = link2SetLink(codeLink);
        const [datasetLink, data_link, datasetName] = link2SetLink(dataLink);

        if (codec) {
            tmp = CreateCodeset(codesetName, codesetLink);
            codeset_id = tmp.codeset_id;
        } else {
            codeset_id = codecid;
        }

        if (datac) {
            tmp = CreateDataset(datasetName, datasetLink);
            dataset_id = tmp.dataset_id;
        } else {
            dataset_id = datacid;
        }

        if (props.onCreate) {
            // res = CreateRCD(paperID, resultID, datasetID, codesetID, dataLink, codeLink, null);
            res = CreateRCD(paperID, resultID, dataset_id, codeset_id, data_link, code_link, null);
        }
        if (props.onEdit) {
            res = CreateRCD(parseInt(paperID), parseInt(resultID), dataset_id, codeset_id, data_link, code_link, props.RCD.rcdId);
        }
        props.onHide();
    };

    return (
        <React.Fragment>
            <Modal show={props.onCreate || props.onEdit} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.onCreate ? "新建RCD" : "修改RCD"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Paper ID</Form.Label>
                            {props.fixedPaperID ?
                                <Form.Control type="text" value={paperID} disabled /> :
                                <Form.Control type="text" value={paperID} onChange={onPaperIDInput} required />
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Result<Button onClick={() => setResultCreating(true)} ><GoPlus /></Button></Form.Label>
                            {
                                props.onCreate ? (
                                    <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example"
                                        onChange={onResultIDInput}>
                                        <option selected>choose a result</option>
                                        {resultList.map((result) => <option value={result.result_id}>{result.result_name}</option>)}
                                    </Form.Select>
                                ) : (props.onEdit && resultID ? (
                                    <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example"
                                        onChange={onResultIDInput}>
                                        {resultList.map((result) => {
                                            if (result.result_id == resultID) {
                                                return (<option selected value={resultID}>{resultName}</option>);
                                            } else {
                                                return (<option value={result.result_id}>{result.result_name}</option>);
                                            }
                                        })}
                                    </Form.Select>) : ""
                                )
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>code link</Form.Label>
                            <Form.Control type="text" maxLength="200" value={codeLink} onChange={onCodeLinkInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>data link</Form.Label>
                            <Form.Control type="text" maxLength="200" value={dataLink} onChange={onDataLinkInput} required />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                {props.onCreate ? "Create" : "Save change"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <CreateResultForm show={resultCreating} paperID={paperID} onHide={() => setResultCreating(false)}></CreateResultForm>
            {/* <CreateCodesetForm show={codesetCreating} onHide={() => setCodesetCreating(false)}></CreateCodesetForm>
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm> */}
        </React.Fragment>
    )
}
export default PostRCDForm;
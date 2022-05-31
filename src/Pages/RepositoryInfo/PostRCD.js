import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateRCD } from '../../Data/rcd';
import { CreateResult, getResultListByPaper } from '../../Data/result';
import CreateResultForm from './CreateResult';
import { getAllCodesetByUser } from '../../Data/codeset';
import { getMyDatasets } from '../../Data/dataset';
import CreateDatasetForm from './CreateDataset';
import { GoPlus } from 'react-icons/go';
import { UserInfo } from '../Utilities/auth';

function PostRCDForm(props) {
    // console.log("debug", props.RCD.paperId, props.fixedPaperID)
    const [paperID, setPaperID] = useState(props.fixedPaperID ? props.fixedPaperID : null);
    const [resultID, setResultID] = useState(null);
    const [datasetID, setDatasetID] = useState(null);
    // const [codesetID, setCodesetID] = useState(null);
    // const [dataLink, setDataLink] = useState("");
    // const [codeLink, setCodeLink] = useState("");
    const [makefile, setMakefile] = useState("");
    const onPaperIDInput = event => setPaperID(event.target.value);
    const onResultIDInput = event => setResultID(event.target.value);
    const onDatasetIDInput = event => setDatasetID(event.target.value);
    // const onCodesetIDInput = event => setCodesetID(event.target.value);
    // const onDataLinkInput = event => setDataLink(event.target.value);
    // const onCodeLinkInput = event => setCodeLink(event.target.value);
    const onMakefileInput = event => setMakefile(event.target.value);

    const [resultCreating, setResultCreating] = useState(false);
    const [codesetCreating, setCodesetCreating] = useState(false);
    const [datasetCreating, setDatasetCreating] = useState(false);

    const [resultList, setResultList] = useState([]);
    const [resultName, setResultName] = useState("");

    // const [codesetList, setCodesetList] = useState([]);
    // const [codesetName, setCodesetName] = useState("");

    const [datasetList, setDatasetList] = useState([]);
    const [datasetName, setDatasetName] = useState("");

    const [validated, setValidated] = useState(false)


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
            let res;
            if (props.onCreate) {
                // res = await CreateRCD(paperID, resultID, datasetID, codesetID, makefile, null);
                res = await CreateRCD(UserInfo.token, parseInt(paperID), parseInt(resultID), parseInt(datasetID), makefile, null);
            }
            if (props.onEdit) {
                console.log('edit', resultID)
                res = await CreateRCD(UserInfo.token, parseInt(paperID), parseInt(resultID), parseInt(datasetID), makefile, props.RCD.rcd_id);
            }
            //console.log(res)
            if (res) {
                
                props.onHide();
                window.location.reload();
            }
        }
    };
    useEffect(() => {
        // setPaperID(props.fixedPaperID?props.RCD.paperId:null);
        setResultID(props.onEdit ? props.RCD.result_id : null);
        setDatasetID(props.onEdit ? props.RCD.dataset_id : null);
        // setCodesetID(props.onEdit ? props.RCD.codeset_id : null);
        // setDataLink(props.onEdit ? props.RCD.data_link : "");
        // setCodeLink(props.onEdit ? props.RCD.code_link : "");
        setMakefile(props.onEdit ? props.RCD.makefile : "");
        //if (props.onEdit) console.log(props.RCD.resultId)
    }, [props.onEdit])
    // useEffect(()=>{
    //     setPaperID(props.fixedPaperID?props.fixedPaperID:null);
    // },[props.onCreate])

    useEffect(() => {
        setPaperID(props.fixedPaperID ? props.fixedPaperID : null);
        getResultListByPaper(props.fixedPaperID).then((data, err) => {
            setResultList(data);
            //console.log("resultlist", data)
        })
        // getAllCodesetByUser().then((data, err) => {
        //     setCodesetList(data);
        //     //console.log("codesetlist", data)
        // })
        if(UserInfo.userName)
        getMyDatasets(UserInfo.token).then((data, err) => {
            setDatasetList(data);
            //console.log("datasetlist", data)
        })
    }, [props.onEdit, props.onCreate, resultCreating, codesetCreating, datasetCreating, UserInfo])

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

    useEffect(() => {
        if (datasetID) {
            const match = datasetList.find(dataset => dataset.dataset_id == datasetID);
            if (match === undefined)
                setDatasetName("");
            else
                setDatasetName(match.dataset_name);
        } else {
            setDatasetName("");
        }
    }, [datasetID])

    return (
        <React.Fragment>
            <Modal show={props.onCreate || props.onEdit} onHide={() => { props.onHide(); setValidated(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.onCreate ? "新建RCD" : "修改RCD"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Paper ID</Form.Label>
                            {props.fixedPaperID ?
                                <Form.Control type="text" value={paperID} disabled /> :
                                <Form.Control type="text" value={paperID} onChange={onPaperIDInput} required />
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Result</Form.Label>
                            {
                                props.onCreate ? (
                                    <React.Fragment>
                                        <Button onClick={() => setResultCreating(true)} ><GoPlus /></Button>
                                        <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" required
                                            onChange={onResultIDInput}>
                                            <option value="">choose a result</option>
                                            {resultList
                                                .filter((result) => result.user_id == UserInfo.userId)
                                                .map((result) => <option value={result.result_id}>{result.result_name}</option>)}
                                        </Form.Select>
                                    </React.Fragment>
                                ) : (props.onEdit && resultID ? (
                                    <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" required //disabled
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
                            <Form.Control.Feedback type="invalid">
                                Please choose a result.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dataset</Form.Label>
                            {
                                props.onCreate ? (
                                    <React.Fragment>
                                        <Button onClick={() => setDatasetCreating(true)}><GoPlus /></Button>
                                        <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" required
                                            onChange={onDatasetIDInput}>
                                            <option value="">choose a dataset</option>
                                            {datasetList.map((dataset) => <option value={dataset.dataset_id}>{dataset.dataset_name}</option>)}
                                        </Form.Select>
                                    </React.Fragment>
                                ) : (props.onEdit && datasetID ? (
                                    <Form.Select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" required //disabled
                                        onChange={onDatasetIDInput}>
                                        {datasetList.map((dataset) => {
                                            if (dataset.dataset_id == datasetID) {
                                                return (<option selected value={datasetID}>{datasetName}</option>);
                                            } else {
                                                return (<option value={dataset.dataset_id}>{dataset.dataset_name}</option>);
                                            }
                                        })}
                                    </Form.Select>) : ""
                                )
                            }
                            <Form.Control.Feedback type="invalid">
                                Please choose a dataset.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>makefile</Form.Label>
                            <Form.Control type="text" maxLength="200" value={makefile} onChange={onMakefileInput} required  placeholder="makefile"/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a makefile.
                            </Form.Control.Feedback>
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
            <CreateDatasetForm show={datasetCreating} onHide={() => setDatasetCreating(false)}></CreateDatasetForm>
        </React.Fragment>
    )
}
export default PostRCDForm;
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { CreateRCD } from '../../Data/rcd';

function PostRCDForm(props){
    // console.log("debug", props.RCD.paperId, props.fixedPaperID)
    const [paperID, setPaperID] = useState(props.fixedPaperID?props.fixedPaperID:null);
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

    function handleSubmit(event) {
        event.preventDefault();
        let res;
        if(props.onCreate){
            res = CreateRCD(paperID, resultID, datasetID, codesetID, dataLink, codeLink, null);
        }
        if(props.onEdit){
            res = CreateRCD(paperID, resultID, datasetID, codesetID, dataLink, codeLink, props.RCD.rcdId);
        }
        props.onHide();
    };
    useEffect(()=>{
        setPaperID(props.fixedPaperID?props.RCD.paperId:null);       
        setResultID(props.onEdit?props.RCD.resultId:null);
        setDatasetID(props.onEdit?props.RCD.datasetId:null);
        setCodesetID(props.onEdit?props.RCD.codesetId:null);
        setDataLink(props.onEdit?props.RCD.dataLink:"");
        setCodeLink(props.onEdit?props.RCD.codeLink:"");
    },[props.onEdit])
    useEffect(()=>{
        setPaperID(props.fixedPaperID?props.fixedPaperID:null);
    },[props.onCreate])

    return (
        <React.Fragment>
            <Modal show={props.onCreate||props.onEdit} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.onCreate?"新建RCD":"修改RCD"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Paper ID</Form.Label>
                            {props.fixedPaperID?
                            <Form.Control type="text" value={paperID} disabled />:
                            <Form.Control type="text" value={paperID} onChange={onPaperIDInput} required />
                            }
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>result ID</Form.Label>
                        <Form.Control type="text" value={resultID}  onChange={onResultIDInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>codeset ID</Form.Label>
                        <Form.Control type="text" value={codesetID} onChange={onCodesetIDInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>dataset ID</Form.Label>
                        <Form.Control type="text" value={datasetID} onChange={onDatasetIDInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>data link</Form.Label>
                            <Form.Control type="text" value={dataLink} onChange={onDataLinkInput} required />
                            
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>code link</Form.Label>
                        <Form.Control type="text" value={codeLink} onChange={onCodeLinkInput} required />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                {props.onCreate?"Create":"Save change"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}
export default PostRCDForm;
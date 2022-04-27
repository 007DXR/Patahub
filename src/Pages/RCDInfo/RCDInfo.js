import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchRCD } from '../../Data/rcd.js';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { getResultList } from '../../Data/result.js'
import { getGithubRawContent } from '../../Data/github.js';
import { getDatasetLinkByID } from '../../Data/dataset.js';
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import SetInfo from './SetInfo.js';
import { getCodesetLinkByID } from '../../Data/codeset.js';

function RCDInfo(props) {
    let p = useParams();
    const [repoName, RCDId] = [p.repoName, p.RCDId];
    const [RCD, setRCD] = useState({});
    const [resultImg, setResultImg] = useState(null);
    const [datasetLink, setDatasetLink] = useState(null);
    const [codesetLink, setCodesetLink] = useState(null);

    useEffect(() => {
        let rcd;
        searchRCD({rcd_id: RCDId}).then((data, err) => {
            if(err)throw err;
            if(data.length>0){
                data=data[0];
                setRCD(data);rcd=data;
                getResultList({result_id: data.result_id}).then((data, err) => {
                    if(data)setResultImg(data[0].result_link);
                    else throw err;
                });
            }else throw 'data.length<=0'
        }).then((data, err) => {
            getDatasetLinkByID(rcd.dataset_id).then((data, err) => {setDatasetLink(data)});
            getCodesetLinkByID(rcd.codeset_id).then((data, err) => {setCodesetLink(data)});
        })
    }, []);
    return (
        <Container>
            <Row>
                {resultImg ? (
                    <Image src={resultImg} style={{maxHeight: '300px', objectFit: 'scale-down'}}/>
                ): <p>Loading</p>}
            </Row>
            <Row>
                <Col className='text-start w-50'>
                    <SetInfo RCD={RCD} setLink={datasetLink} link={RCD.data_link}/>
                </Col>
                <Col className='text-start w-50'>
                    <SetInfo RCD={RCD} setLink={codesetLink} link={RCD.code_link}/>
                </Col>
            </Row>
        </Container>
    )
}

export default RCDInfo;

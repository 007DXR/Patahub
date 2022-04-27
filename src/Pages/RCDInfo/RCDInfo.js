import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchRCD } from '../../Data/rcd.js';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { getResultList } from '../../Data/result.js'
import { getGithubRawContent } from '../../Data/github.js';
import { getDatasetById } from '../../Data/dataset.js';
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

function RCDInfo(props) {
    let p = useParams();
    const [repoName, RCDId] = [p.repoName, p.RCDId];
    const [RCD, setRCD] = useState(null);
    const [resultImg, setResultImg] = useState(null);
    const [code, setCode] = useState('');
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
            if(err)throw err;
            return getDatasetById(rcd.dataset_id)
        }).then((data, err) => {
            if(err)throw err;
            return getGithubRawContent(data[0].dataset_link, rcd.data_link);
        }).then((data, err) => {
            setCode(data);
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
                <Col className='text-start'>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {"```" + 
                        ((code && RCD) ? RCD.data_link.substring(RCD.data_link.lastIndexOf(".")+1) +"\n" + 
                        code + "\n" : "\nLoading...\n") 
                    + "```"
                    }
                </ReactMarkdown>
                </Col>
                <Col>右边</Col>
            </Row>
        </Container>
    )
}

export default RCDInfo;

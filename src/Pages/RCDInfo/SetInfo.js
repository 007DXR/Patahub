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
import { Link } from 'react-router-dom';

function SetInfo(props) {
    const [contents, setContents] = useState('');
    const checkIfAvailable = (data) => {
        const arr = ['c','py','js','cpp','html','css'];
        return arr.indexOf(data)==-1?"":data;
    }
    useEffect(() => {
        if(props.setLink && props.link)
        getGithubRawContent(props.setLink, props.link).then((data, err) => {
            setContents(data);
        })
    }, [props.RCD, props.setLink, props.link]);
    return contents ? (typeof contents == 'string') ? (
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {"```" + 
                ((contents && props.RCD) ? checkIfAvailable(props.RCD.data_link.substring(props.RCD.data_link.lastIndexOf(".")+1)) +"\n" + 
                contents + "\n" : "\nLoading...\n") 
            + "```"
            }
        </ReactMarkdown>
    ) : (
        <div>
        {contents.map((obj) => (
            <React.Fragment>
                <a href={obj._links.html}>{obj.name}</a>
                <br/>
            </React.Fragment>
        ))}
        </div>
    ) : (<p>Loading...</p>);
}

export default SetInfo;

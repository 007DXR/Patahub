import React from 'react';
import { Link, } from "react-router-dom";
import { getRepositoryInfo } from '../../Data/demo.js'
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';


function RepoOverView(props) {
    const [repoInfo, setRepoInfo] = useState(null);
    useEffect(() => {
        getRepositoryInfo(props.repoName).then((data, err) => {
            setRepoInfo(data);
            console.log(data);
        });
    }, []);
    return repoInfo?(
        <React.Fragment>
            <Link to={'/repositoryInfo/'+props.repoName}>
                <h1 className="repositoryPaperOverView-title">{repoInfo.paperTitle}</h1>
            </Link>
            <Container>
                <Row>
                    <Col>
                        {repoInfo.paperAbstract}
                    </Col>
                    <Col>
                        {repoInfo.dataSetLink[0]}
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    ):(
        <></>
    );
}

export default RepoOverView;

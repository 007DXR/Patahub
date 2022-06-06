import React from 'react';
import { useEffect, useState } from 'react';
import { searchAll } from '../../Data/link.js';
import RCDOverView from '../RepositoryInfo/RCDOverView.js';
import { searchRCD } from '../../Data/rcd.js'
import { Card, Container, Row } from 'react-bootstrap';


function SearchRCD(props){
    const [RCDs, setRCDs] = useState([]);
    useEffect(()=>{
        searchRCD(props.params).then((data,err) => {
            console.log(data);
            if(data)setRCDs(data);
            if(err)throw err;
        });
    },[]);
    return(<Container className="w-50 pt-5">
        {RCDs.map((RCD) => (
            <Row>
                <Card className="m-3 py-3">
                    <RCDOverView RCD={RCD} repoName={RCD.paper_id}/>
                </Card>
            </Row>
        ))}
    </Container>)
}
export default SearchRCD;
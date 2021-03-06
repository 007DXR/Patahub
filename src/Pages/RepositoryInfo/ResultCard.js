import React,{ useState } from "react";
import { Button, Card } from "react-bootstrap";
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { DeleteResult } from "../../Data/result";
import { UserInfo } from "../Utilities/auth";
import { RiFilePaper2Line } from 'react-icons/ri'
import { Link } from "react-router-dom";
import { RiEditFill } from 'react-icons/ri';

function ResultCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editResult = () => {
        if(props.result.user_id && props.result.user_id == UserInfo.userId){
            props.onEdit();
            setShowEdit(true);
        }
    };

    return (
        <>
            <Card className="mt-3 pt-3">
                <Card.Title>
                    {props.result.result_name}
                    <Link className="ms-1" to={`/repositoryInfo/${props.result.paper_id}`}><RiFilePaper2Line/></Link>
                </Card.Title>
                <Card.Body>
                    <p>
                    value: {props.result.result_link?(<a href={props.result.result_link}>{props.result.result_value}</a>):(props.result.result_value)}
                    <br/>
                    description: {props.result.result_description}
                    </p>
                    {props.edit ?
                        <React.Fragment>
                            <Button onClick={editResult} className="btn-sm"><RiEditFill /></Button>
                            <Button onClick={function (event) {
                                event.stopPropagation()
                                DeleteResult(UserInfo.token, props.result.result_id).then((data, err) => {
                                    if (data) window.location.reload();
                                    else alert(err);
                                });
                            }} className="btn-sm btn-danger"> <BsFillTrashFill /></Button></React.Fragment>
                        : null}
                </Card.Body> 
                
            </Card>
        </>
    )
}

export default ResultCard;
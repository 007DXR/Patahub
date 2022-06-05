import React,{ useState } from "react";
import { Button, Card } from "react-bootstrap";
import { BsFillTrashFill, BsSaveFill } from 'react-icons/bs';
import { DeleteDataset } from "../../Data/dataset";
import { UserInfo } from "../Utilities/auth";
import { RiEditFill } from 'react-icons/ri';

function DatasetCard(props) {
    const [showEdit, setShowEdit] = useState(false);
    const editDataset = () => {
        if(props.dataset.user_id && props.dataset.user_id == UserInfo.userId){
            props.onEdit();
            setShowEdit(true);
        }
    };

    return (
        <>
            <Card className="mt-3 pt-3">
                <Card.Title>{props.dataset.dataset_name}</Card.Title>
                <Card.Body>
                    <p>
                    <a href={props.dataset.dataset_link}>{props.dataset.dataset_link}</a>
                    </p>
                    { props.edit ? 
                        <React.Fragment>
                            <Button onClick={editDataset} className="btn-sm"><RiEditFill /></Button>
                            <Button onClick={function (event) {
                                event.stopPropagation()
                                DeleteDataset(UserInfo.token, props.dataset.dataset_id).then((data, err) => {
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

export default DatasetCard;
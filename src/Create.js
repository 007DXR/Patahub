import React, { useState } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import CreateResultForm from './Pages/RepositoryInfo/CreateResult.js'
import CreateDatasetForm from './Pages/RepositoryInfo/CreateDataset.js'


export function CreateButton() {
    const [create, setCreate] = useState(null);
    return (<DropdownButton title="Create">
        <Dropdown.Item href="/createRepo/">Repository</Dropdown.Item>
        <Dropdown.Item onClick={() => setCreate('dataset')}>Data Set</Dropdown.Item>
        <CreateResultForm show={create=='result'} onHide={() => setCreate(null)}/>
        {/*
        <Dropdown.Item onClick={() => setCreate('result')}>Result</Dropdown.Item>
        <CreateDatasetForm show={create=='dataset'} onHide={() => setCreate(null)}/>
        */}
    </DropdownButton>)
}

export default CreateButton;
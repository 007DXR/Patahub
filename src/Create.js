import React, { useState } from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import { Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';
import { GoSearch } from 'react-icons/go';
import { GrSearchAdvanced } from 'react-icons/gr';
import { getAllRepositories, searchRepositories } from './Data/link';
import SearchBar from './SearchBar.js';
import { CreateRepoButton } from './Pages/AllRepositories/CreateRepo.js'
import DeleteRepoButton from './Pages/AllRepositories/DeleteRepo.js';
import avatar from './Avatar.svg';
import { CreateDatasetButton } from './Pages/RepositoryInfo/CreateDatasetPage';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { GoPlus } from 'react-icons/go';


export function CreateButton() {
    return (<DropdownButton title="Create">
        <Dropdown.Item href="/createRepo/">Repository</Dropdown.Item>
        <Dropdown.Item href="/createDataset/">Data Set</Dropdown.Item>
    </DropdownButton>)
}

export default CreateButton;
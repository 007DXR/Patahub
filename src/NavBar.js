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
import { CreateDatasetButton } from './Pages/RepositoryInfo/CreateDatasetPage';
import CreateButton from './Create.js'
import User from './User.js'
import {UserInfo, setUserInfo} from './Pages/Utilities/auth.js'

function NavBar(props) {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    Patahub
                </Navbar.Brand>
                {props.disableSearchbar ? <React.Fragment /> : <SearchBar />}
                <CreateButton />
                <div className='ms-auto me-auto'></div>
                <User/>
            </Container>
        </Navbar>
    );
}

export default NavBar;

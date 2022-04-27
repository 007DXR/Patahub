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

function UserAvatar(props) {
    const toUserHomepage = async () => {
        window.location.replace(`/UserHomepage/${props.userName}`);
    }
    return (
        <img className="rounded-circle" src={avatar} alt="user"
            width="30" height="30" onClick={toUserHomepage}></img>
    )
}

function NavBar(props) {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    Patahub
                </Navbar.Brand>
                {props.disableSearchbar ? <React.Fragment /> : <SearchBar />}
                <CreateRepoButton />
                {props.deleteRepoButton ? <DeleteRepoButton /> : <React.Fragment />}
                <div className='ms-auto me-auto'></div>
                <UserAvatar userName="user"></UserAvatar>
            </Container>
        </Navbar>
    );
}

export default NavBar;

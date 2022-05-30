import React, { useState } from 'react';
import { Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';
import SearchBar from './SearchBar.js';
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
                {UserInfo.userName ? <CreateButton /> : null}
                <div className='ms-auto me-auto'></div>
                <User/>
            </Container>
        </Navbar>
    );
}

export default NavBar;

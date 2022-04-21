import React from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import { Navbar, Container} from 'react-bootstrap';

function NavBar(){
    return (
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/">
                <img src={logo}></img>
                Patahub
            </Navbar.Brand>
          </Container>
        </Navbar>
    );
}

export default NavBar;

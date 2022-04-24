import React, { useState } from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import { Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';
import { GoSearch } from 'react-icons/go';
import { GrSearchAdvanced } from 'react-icons/gr';
import { getAllRepositories, searchRepositories } from './Data/link';

function SearchBar() {
  const [op, setOp] = useState(0);
  const [content, setContent] = useState("");
  const disabled = !(op && content.length > 0);
  const getSearchInfo = async () => {
    window.location.replace(`/search/${op}/${content}`);
  }
  return (
    <Form className="d-flex">
      <Form.Select aria-label="Default select example" className="me-1 w-50" value={op} onChange={(event) => { setOp(event.target.value) }}>
        <option value="">Search by...</option>
        <option value="paper_name">Paper title</option>
        <option value="paper_id">Paper ID</option>
      </Form.Select>
      <FormControl
        type="search"
        placeholder="Search"
        className="me-1"
        aria-label="Search"
        value={content}
        onChange={(event) => { setContent(event.target.value); }}
      />
      {disabled ?
        (<Button variant="gray" onClick={getSearchInfo} disabled><GoSearch /></Button>)
        : (<Button variant="info" onClick={getSearchInfo}><GoSearch /></Button>)
      }
    </Form>
  )
}
function NavBar(props) {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          {/*<img src={logo}></img>*/}
          Patahub
        </Navbar.Brand>
        {props.more}
        <SearchBar />
      </Container>
    </Navbar>
  );
}

export default NavBar;

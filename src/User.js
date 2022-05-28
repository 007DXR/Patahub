import React, { useState } from 'react';
import avatar from './logo.png';
import { Modal, Form, Button } from 'react-bootstrap';
import {tryLogin, tryRegister, tryLogout} from './Data/User.js'
import { setUserInfo, UserInfo } from './Pages/Utilities/auth';


export function UserAvatar(props) {
    const toUserHomepage = async () => {
        window.location.replace(`/UserHomepage/${props.userName}`);
    }
    return (
        <img className="rounded-circle" src={avatar} alt="user"
            width="30" height="30" onClick={toUserHomepage}></img>
    )
}

function UserName(props) {
    const toUserHomepage = async () => {
        window.location.replace(`/UserHomepage/${props.userName}`);
    }
    return (
        <Button onClick={toUserHomepage} className='my-auto text-light fw-bold fs-6'>{props.userName}</Button>
    )
}

function User(props) {

    function Login(event){
        const [userName, setUserName] = useState();
        const [userPassword, setUserPassword] = useState();
        const [isShown, setIsShown] = useState(false);
        let handleLogin = (event) => {
            event.preventDefault();
            tryLogin(userName, userPassword).then((data, err) => {
                if(err)alert(err);
                if(data){
                    let Info = {
                        userName,
                        token: data["token_type"] + ' ' + data["access_token"],
                    };
                    setUserInfo(Info);
                    window.localStorage.setItem('UserInfo', JSON.stringify(Info));
                    window.location.reload();
                }
            }, error=>{alert(error.responseJSON.detail)})
        }
        let showForm = () => {setIsShown(true);}
        return (
            <React.Fragment>
            <Modal show={isShown} onHide={() => {setIsShown(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>登录</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control type="text" value={userName} onChange={(event) => setUserName(event.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={userPassword} onChange={(event) => setUserPassword(event.target.value)}/>
                        </Form.Group>
                        <Button type='submit'>Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Button onClick={showForm}>Login</Button>
            </React.Fragment>);
    }
    function Register(event){
        const [userName, setUserName] = useState();
        const [userEmail, setUserEmail] = useState();
        const [userPassword, setUserPassword] = useState();
        const [isShown, setIsShown] = useState(false);
        let handleRegister = (event) => {
            event.preventDefault();
            tryRegister(userName, userEmail, userPassword).then((data, err) => {
                if(err)alert(err);
                if(data){
                    alert('Success!');
                    setIsShown(false);
                }
            }, error=>{alert(error.responseJSON.detail)})
        }
        let showForm = () => {setIsShown(true);}
        return (
            <React.Fragment>
            <Modal show={isShown} onHide={() => {setIsShown(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>注册</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control type="text" value={userName} onChange={(event) => setUserName(event.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={userEmail} onChange={(event) => setUserEmail(event.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={userPassword} onChange={(event) => setUserPassword(event.target.value)}/>
                        </Form.Group>
                        <Button type='submit'>Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Button onClick={showForm}>Register</Button>
            </React.Fragment>);
    }

    let Logout = (event) => {
        window.localStorage.removeItem('UserInfo');
        window.location.reload();
    };

    return UserInfo.loading ? (
        <Button>Loading...</Button>
    ) : UserInfo.userName ? (
        <React.Fragment>
            <UserName userName={UserInfo.userName}></UserName>
            <Button onClick={Logout}>Logout</Button>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <Login></Login>
            <Register></Register>
        </React.Fragment>
    )
}

export default User;
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import avatar from './logo.png';

export function UserAvatar(props) {
    const toUserHomepage = async () => {
        window.location.replace(`/UserHomepage/${props.userName}`);
    }
    return (
        <img className="rounded-circle" src={avatar} alt="user"
            width="30" height="30" onClick={toUserHomepage}></img>
    )
}

export function LogInButton(props) {
    return <Button onClick={props.onClick}> Sign in </Button>
}

export function LogOutButton(props) {
    return <Button onClick={props.onClick}> Sign out </Button>
}

export function User() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    return isLoggedIn ? (
        <React.Fragment>
            <UserAvatar userName="user"></UserAvatar>
            <LogOutButton onClick={() => setIsLoggedIn(false)} />
        </React.Fragment>
    ) : (
        <LogInButton onClick={() => setIsLoggedIn(true)} />
    )
}

export default User;
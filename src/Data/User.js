import $ from 'jquery';
import sha256 from 'crypto-js/sha256';

function passwordCrypto(pw){
    return sha256('PatahubQWQQWwqwqwqwq' + pw + '233333333NeverGonnaGiveUUp').toString();
}

export async function tryLogin(userName, userPassword) {
    return $.ajax({
        url: '/api/login',
        type: "POST",
        data: {
            'username': userName,
            'password': passwordCrypto(userPassword),
        },
    });
}
export async function tryRegister(userName, userEmail, userPassword) {
    return $.ajax({
        url: '/api/register',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            'user_name': userName,
            'user_email': userEmail,
            'user_password': passwordCrypto(userPassword),
        })
    });
}

export async function validateUser(userInfo, setUserInfo) {
    return $.ajax({
        url: '/api/userinfo',
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers:{
            Authorization: userInfo.token
        },
    });
}

export async function updateUser(token, userName, userEmail, userPassword, userId) {
    return $.ajax({
        url: '/api/userinfo/' + userId,
        type: "put",
        data: JSON.stringify({
            'user_name': userName,
            'user_email': userEmail,
            'user_password': passwordCrypto(userPassword),
        }),
        contentType: "application/json",
        headers:{
            Authorization: token
        },
    });
}
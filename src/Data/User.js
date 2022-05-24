import $ from 'jquery';

export async function tryLogin(userName, userPassword) {
    return $.ajax({
        url: '/api/login',
        type: "POST",
        data: {
            'grant_type': null,
            'scope': null,
            'client_id': null,
            'client_secret': null,
            'username': userName,
            'password': userPassword,
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
            'user_password': userPassword,
        })
    });
}

export async function tryLogout() {
}
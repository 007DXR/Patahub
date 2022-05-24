import $ from 'jquery';

export async function getAllCodeset() {
    const data = {}
    return $.get('/api/codeset', data);
}

export async function getCodeset(data) {
    return $.get('/api/codeset', data);
}

export async function getCodesetLinkByID(codesetID) {
    const data = { codeset_id: codesetID }
    return await getCodeset(data).then((data, err) => {
        if (err) throw err;
        return data[0].codeset_link;
    })
}

export async function getAllCodesetByUser(userID) {
    const data = {
        user_id: userID
    }
    return $.get('/api/codeset', data);
}
export async function getCodesetById(codeset_id) {
    return $.get('/api/codeset', { codeset_id });
}


export function CreateCodeset(token, codesetName, codesetLink) {
    let res = null;
    const data = {
        codeset_name: codesetName,
        codeset_link: codesetLink
    }

    $.ajax({
        type: "post",
        url: `/api/codeset`,
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: (data) => { res = data },
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    return res
}

export function EditCodeset(token, codesetID, codesetName, codesetLink){
    let res = false;
    const data = {
        codeset_name: codesetName,
        codeset_link: codesetLink,
        codeset_id: codesetID
    }

    $.ajax({
        type: "post",
        url: `/api/codeset`,
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: () => { res = true },
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    console.log("post data", res)
    return res
}

export function DeleteCodeset(token, codesetID) {
    let res = null;
    $.ajax({
        type: "delete",
        url: `/api/codeset?codeset_id=${codesetID}`,
        async: false,
        success: (data) => { res = data },
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    return res
}
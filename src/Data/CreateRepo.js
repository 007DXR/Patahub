import $ from 'jquery'

export async function CreateRepo(token, params) {
    let res = null
    const data = JSON.stringify(params)
    await $.ajax({
        type: "post",
        url: `/api/paper`,
        data: data,
        contentType: "application/json",
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    return res
}

export async function UpdateRepo(token, paperId, params) {
    let res = null
    let Params = Object.Object(params);
    Params.paper_id = paperId;
    const data = JSON.stringify(Params);
    await $.ajax({
        type: "post",
        url: `/api/paper`,
        data: data,
        contentType: "application/json",
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    return res
}
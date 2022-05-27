import $ from 'jquery'

export async function CreateRepo(token, params) {
    const data = JSON.stringify(params)
    return $.ajax({
        type: "post",
        url: `/api/paper`,
        data: data,
        contentType: "application/json",
        headers:{
            Authorization: token
        }
    });
}

export async function UpdateRepo(token, paperId, params) {
    let Params = structuredClone(params);
    Params.paper_id = Number(paperId);
    const data = JSON.stringify(Params);
    return $.ajax({
        type: "put",
        url: `/api/paper/${paperId}`,
        data: data,
        contentType: "application/json",
        headers:{
            Authorization: token
        }
    });
}
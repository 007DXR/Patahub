import $ from 'jquery';

export async function getAllCodeset(){
    const data = {}
    return $.get('/api/codeset', data);
}

export async function getCodeset(data){
    return $.get('/api/codeset', data);
}

export async function getCodesetLinkByID(codesetID){
    const data = {codeset_id: codesetID}
    return await getCodeset(data).then((data, err)=>{
        if(err)throw err;
        return data[0].codeset_link;
    })
}

export async function getAllCodesetByUser(userID){
    const data = {
        user_id: userID
    }
    return $.get('/api/codeset', data);
}
export async function getCodesetById(codeset_id){
    return $.get('/api/codeset', {codeset_id});
}


export function CreateCodeset(codesetName, codesetLink){
    let res = null;
    const data = {
        user_id: 1,
        codeset_name: codesetName,
        codeset_link: codesetLink
    }
    
    //console.log("post data", data);

    $.ajax({
        type: "post",
        url: "/api/codeset",
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: (data) => {res = data},
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    //console.log("post data", res)
    return res
}
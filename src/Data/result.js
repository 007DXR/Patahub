import $ from 'jquery';

export async function getResultList(options){
    return $.get('/api/result', options);
}

export async function getResultListByPaper(paperID){
    const data = {
        paper_id: paperID
    }
    return $.get('/api/result', data);
}

export function CreateResult(token, resultName, resultDescription, resultValue, paperID){
    let res = null;
    const data = {
        // result_type: resultType,
        result_name: resultName,
        result_description: resultDescription,
        result_value: resultValue,
        // result_link: "link",
        paper_id: paperID
    }
    

    $.ajax({
        type: "post",
        url: `/api/result`,
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: (data) => {res = data},
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    return res
}
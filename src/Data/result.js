import $ from 'jquery';

export async function getResultListByPaper(paperID){
    const data = {
        paper_id: paperID
    }
    return $.get('/api/result', data);
}

export function CreateResult(resultType, resultName, resultLink, paperID){
    let res = null;
    const data = {
        user_id: 1,
        result_type: resultType,
        result_name: resultName,
        result_link: resultLink,
        paper_id: paperID
    }
    
    console.log("post result", data);

    $.ajax({
        type: "post",
        url: "/api/result",
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: (data) => {res = data},
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    console.log("post result after", res)
    return res
}
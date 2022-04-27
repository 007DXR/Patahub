import $ from 'jquery';
import { parseGithubLink } from "./github.js"

export async function getResult(resultID) {
    const data = {
        result_id: resultID
    }
    return $.get('/api/result', data);
}

export async function getResultLink(resultID) {
    return await getResult(resultID).then((data, err) => {
        if (err) throw err;
        return data[0].result_link;
    })
}

export async function CreateRCD(paperID, resultID, datasetID, codesetID, dataLink, codeLink, rcdID) {
    let succ = false;
    let data;
    if (rcdID === null) {
        data = {
            user_id: 1,
            paper_id: paperID,
            result_id: resultID,
            codeset_id: codesetID,
            dataset_id: datasetID,
            code_link: codeLink,
            data_link: dataLink
        }
    } else {
        data = {
            user_id: 1,
            paper_id: paperID,
            result_id: resultID,
            codeset_id: codesetID,
            dataset_id: datasetID,
            code_link: codeLink,
            data_link: dataLink,
            rcd_id: rcdID
        }
    }

    //console.log("post data",data);
    await $.ajax({
        type: "post",
        url: "/api/rcd",
        data: JSON.stringify(data),
        contentType: "application/json",
        async: true,
        success: (data) => succ = true,//succ=true;
        error: function (XMLHttpRequest, texterror) {
            // console.log("请求失败，无法post RCD", XMLHttpRequest.responseText, texterror);
            // succ = false;
            // res = XMLHttpRequest.responseText;
            alert(XMLHttpRequest.responseText);
        }
    });
    //console.log("post data", res)
    // return $.post('/api/rcd',data);
    return succ//[succ, res]
}

export function DelRCD(rcdID) {
    let success = false
    const data = JSON.stringify({
        rcd_id: rcdID
    })
    $.ajax({
        type: "delete",
        url: `/api/rcd?rcd_id=${rcdID}`,
        contentType: "application/json",
        async: false,
        success: () => success = true,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    return success
}

export async function searchRCD(options) {
    return $.get('/api/rcd', options);
}

export async function getRCDByRepoID(repoID) {
    return searchRCD({ paper_id: repoID });
}


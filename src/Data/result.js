import $ from 'jquery';

export async function getResultList(options) {
    return $.get('/api/result', options);
}

export async function getResultListByPaper(paperID) {
    const data = {
        paper_id: paperID
    }
    return $.get('/api/result', data);
}

export async function getResultByID(ID) {
    const data = {
        result_id: ID
    }
    return $.get('/api/result', data);
}

export async function getResultListByRCD(rcdID) {
    const data = {
        rcd_id: rcdID
    }
    return $.get('/api/result_in_rcd', data);
}

export async function CreateResult(token, resultName, resultDescription, resultValue, paperID) {
    const data = {
        // result_type: resultType,
        result_name: resultName,
        result_description: resultDescription,
        result_value: resultValue,
        // result_link: "link",
        paper_id: paperID
    }


    return $.ajax({
        type: "post",
        url: `/api/result`,
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {
            Authorization: token
        }
    });
}

export async function CreateResultIntoRCD(token, rcdID, resultID) {
    return $.ajax({
        type: "post",
        url: `/api/rcd/${rcdID}?result_id=${resultID}`,
        headers: {
            Authorization: token
        }
    });
}

export function EditResult(token, resultName, resultDescription, resultValue, paperID, resultID) {
    const data = {
        // result_type: resultType,
        result_name: resultName,
        result_description: resultDescription,
        result_value: resultValue,
        // result_link: "link",
        paper_id: paperID,
        result_id: resultID,
    }


    return $.ajax({
        type: "put",
        url: `/api/result/${resultID}`,
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {
            Authorization: token
        }
    });
}
export function DeleteResult(token, datasetID) {
    return $.ajax({
        type: "delete",
        url: `/api/result?result_id=${datasetID}`,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers: {
            Authorization: token
        }
    });
}
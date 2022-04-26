import $ from 'jquery';

export async function getAllDataset(){
    const data = {}
    return $.get('/api/dataset', data);
}

export async function getAllDatasetByUser(userID){
    const data = {
        user_id: userID
    }
    return $.get('/api/dataset', data);
}

export function CreateDataset(datasetName, datasetLink){
    let res = null;
    const data = {
        user_id: 1,
        dataset_name: datasetName,
        dataset_link: datasetLink
    }
    
    console.log("post data", data);

    $.ajax({
        type: "post",
        url: "/api/dataset",
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: (data) => {res = data},
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    console.log("post data", res)
    return res
}
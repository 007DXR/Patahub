import $ from 'jquery';

export async function getAllDataset(){
    const data = {}
    return $.get('/api/dataset', data);
}

export async function getDataset(data){
    return $.get('/api/dataset', data);
}

export async function getDatasetLinkByID(datasetID){
    const data = {dataset_id: datasetID}
    return await getDataset(data).then((data, err)=>{
        if(err)throw err;
        return data[0].dataset_link;
    })
}

export async function getAllDatasetByUser(userID){
    const data = {
        user_id: userID
    }
    return $.get('/api/dataset', data);
}

export async function getDatasetById(dataset_id){
    return $.get('/api/dataset', {dataset_id});
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

export function DeleteDataset(datasetID) {
    let res = null;
    $.ajax({
        type: "delete",
        url: `/api/dataset?dataset_id=${datasetID}`,
        async: false,
        success: (data) => { res = data },
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    console.log("post data", res)
    return res
}
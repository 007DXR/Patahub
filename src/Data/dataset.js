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

export async function getAllDatasetByUser(){
    return $.get('/api/dataset');
}

export async function getDatasetById(dataset_id){
    return $.get('/api/dataset', {dataset_id});
}

export function CreateDataset(token, datasetName, datasetLink){
    const data = {
        dataset_name: datasetName,
        dataset_link: datasetLink
    }
    
    // console.log("post data", data);

    return $.ajax({
        type: "post",
        url: `/api/dataset`,
        data: JSON.stringify(data),
        contentType: "application/json",
        headers:{
            Authorization: token
        }
    });
}

export function EditDataset(token, datasetID, datasetName, datasetLink){
    const data = {
        dataset_name: datasetName,
        dataset_link: datasetLink,
    }

    return $.ajax({
        type: "put",
        url: `/api/dataset/${datasetID}`,
        data: JSON.stringify(data),
        contentType: "application/json",
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
}
export function DeleteDataset(token, datasetID) {
    return $.ajax({
        type: "delete",
        url: `/api/dataset?dataset_id=${datasetID}`,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
}
import $ from 'jquery';
import { parseGithubLink } from "./github.js"
import { searchRepositories } from './link.js';

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

export async function getResultDetail(resultID) {
    return await getResult(resultID).then((data, err) => {
        if (err) throw err;
        return data[0];
    })
}

export async function getPaperById(repoID) {
    return await searchRepositories({paper_id: repoID}).then((data, err) => {
        if (err) throw err;
        return data[0];
    });
    // return searchRepositories({ paper_id: repoID });
}

export async function CreateRCD(token, paperID, resultID, datasetID, makefile, rcdID) {
    let data;
    if (rcdID === null) {
        data = {
            paper_id: paperID,
            result_id: resultID,
            //codeset_id: codesetID,
            dataset_id: datasetID,
            // code_link: codeLink,
            // data_link: dataLink
            makefile: makefile
        };
    } else {
        data = {
            paper_id: paperID,
            result_id: resultID,
            //codeset_id: codesetID,
            dataset_id: datasetID,
            // code_link: codeLink,
            // data_link: dataLink,
            makefile: makefile,
            rcd_id: rcdID,
        }
    }

    return $.ajax({
        type: rcdID ? "put" : "post",
        url: `/api/rcd` + (rcdID ? '/' + rcdID : ''),
        data: JSON.stringify(data),
        contentType: "application/json",
        headers:{
            Authorization: token
        }
    });
}

export function DelRCD(token, rcdID) {
    const data = JSON.stringify({
        rcd_id: rcdID
    })
    return $.ajax({
        type: "delete",
        url: `/api/rcd?rcd_id=${rcdID}`,
        contentType: "application/json",
        headers:{
            Authorization: token
        },
    });
}

export async function searchRCD(options) {
    return $.get('/api/rcd', options);
}

export async function getRCDByRepoID(repoID) {
    return searchRCD({ paper_id: repoID });
}


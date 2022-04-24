import { json } from 'body-parser';
import $ from 'jquery';
import { parseGithubLink } from "./github.js"

export async function getRCDListByID(paperID) {
    await sleep(Math.round(Math.random() * 2000));
    // return [
    // {
    //     resultId:1,
    //     resultImage: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
    //     codeLinks: [`https://github.com/007DXR/Patahub`],
    //     datasetLinks: [`https://github.com/facebook/react`],
    // },{
    //     resultId:2,
    //     resultImage: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    //     codeLinks: [`https://github.com/typescript-cheatsheets/react`,`https://github.com/discountry/react`],
    //     datasetLinks: [`https://github.com/vnotex/vnote`,`https://www.github.com/${repoName}/xxyfdsafydataset`,`https://www.github.com/${repoName}/xxwwwwydataset`,],
    // },];

    const data = JSON.stringify({
        paper_id: paperID,
    })
    $.ajax({
        type: "get",
        url: "api/rcd",
        data: data,
        contentType: "application/json",
        async: false,
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            console.log("请求失败，无法获取RCD列表");
        }
    });
    return res
}

function getSetID(link, setType){
    let setName = parseGithubLink(link)[1];
    let setID = null;
    let data = null;
    if (setType == "dataset"){
        data = JSON.stringify({
            dataset_name: setName,
        })
    }else{
        data = JSON.stringify({
            codeset_name: setName,
        })
    }
    
    $.ajax({
        type: "get",
        url: `api/${setType}`,
        data: data,
        contentType: "application/json",
        async: false,
        success: (res) => setID = res,
        error: function (XMLHttpRequest, texterror) {
            console.log("请求失败，无法创建RCD");
        }
    });
    return setID
}

export function CreateRCD(resultLink, codeLink, dataLink, paperID){
    let res = null;
    const codesetID = getSetID(codeLink);
    const datasetID = getSetID(dataLink);
    const resultID = getResultID(resultLink);
    const data = JSON.stringify({
        paper_id: paperID,
        result_id: resultID,
        codeset_id: codesetID,
        dataset_id: datasetID,
        code_link: codeLink,
        data_link: dataLink,
        rcd_id: 0,
    })
    $.ajax({
        type: "post",
        url: "api/rcd",
        data: data,
        contentType: "application/json",
        async: false,
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            console.log("请求失败，无法创建RCD");
        }
    });
    return res
}

export function EditRCD(paperID, resultID, codeLink, dataLink, rcdID){
    const codesetID = getSetID(codeLink);
    const datasetID = getSetID(dataLink);
    const data = JSON.stringify({
        paper_id: paperID,
        result_id: resultID,
        codeset_id: codesetID,
        dataset_id: datasetID,
        code_link: codeLink,
        data_link: dataLink,
        rcd_id: rcdID,
    })
    $.ajax({
        type: "post",
        url: "api/rcd",
        data: data,
        contentType: "application/json",
        async: false,
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            console.log("请求失败，无法修改RCD");
        }
    });
}

export function DelRCD(rcdID){
    const data = JSON.stringify({
        rcd_id: rcdID,
    })
    $.ajax({
        type: "delete",
        url: "api/rcd",
        data: data,
        contentType: "application/json",
        async: false,
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            console.log("请求失败，无法删除RCD");
        }
    });
    return res
}
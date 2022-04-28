import $ from 'jquery'

export async function CreateRepo(paperName, paperLink, paperAbstract) {
    let res = null
    const data = JSON.stringify({
        user_id: 0,
        paper_name: paperName,
        paper_link: paperLink,
        paper_abstract: paperAbstract
    })
    await $.ajax({
        type: "post",
        url: "/api/paper",
        data: data,
        contentType: "application/json",
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    return res
}

export async function UpdateRepo(paperId, paperName, paperLink, paperAbstract) {
    let res = null
    const data = JSON.stringify({
        user_id: 0,
        paper_id: paperId,
        paper_name: paperName,
        paper_link: paperLink,
        paper_abstract: paperAbstract
    })
    await $.ajax({
        type: "post",
        url: "/api/paper",
        data: data,
        contentType: "application/json",
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    return res
}
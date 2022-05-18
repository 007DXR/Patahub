import $ from 'jquery'

export async function CreateRepo(userID, paperName, paperLink, dockerLink, paperAbstract) {
    let res = null
    const data = JSON.stringify({
        user_id: userID,
        paper_name: paperName,
        paper_link: paperLink,
        docker_link: dockerLink,
        paper_abstract: paperAbstract
    })
    await $.ajax({
        type: "post",
        url: `/api/paper?cur_user_id=${userID}`,
        data: data,
        contentType: "application/json",
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    return res
}

export async function UpdateRepo(userID, paperId, paperName, paperLink, dockerLink, paperAbstract) {
    let res = null
    const data = JSON.stringify({
        user_id: userID,
        paper_id: paperId,
        paper_name: paperName,
        paper_link: paperLink,
        docker_link: dockerLink,
        paper_abstract: paperAbstract
    })
    await $.ajax({
        type: "post",
        url: `/api/paper?cur_user_id=${userID}`,
        data: data,
        contentType: "application/json",
        success: (data) => res = data,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    return res
}
import $ from 'jquery'

async function DeleteRepo(token, paperId) {
    let success = false
    const data = JSON.stringify({
        paper_id: paperId
    })
    await $.ajax({
        type: "delete",
        url: `/api/paper?paper_id=${paperId}`,
        contentType: "application/json",
        success: () => success = true,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        },
        headers:{
            Authorization: token
        }
    });
    return success
}

export default DeleteRepo;
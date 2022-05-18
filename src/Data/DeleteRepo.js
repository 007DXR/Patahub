import $ from 'jquery'

async function DeleteRepo(userID, paperId) {
    let success = false
    const data = JSON.stringify({
        paper_id: paperId
    })
    await $.ajax({
        type: "delete",
        url: `/api/paper?cur_user_id=${userID}&paper_id=${paperId}`,
        contentType: "application/json",
        success: () => success = true,
        error: function (XMLHttpRequest, texterror) {
            alert(XMLHttpRequest.responseText);
        }
    });
    return success
}

export default DeleteRepo;
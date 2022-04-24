import $ from 'jquery'

function DeleteRepo(paperId) {
    let success = false
    const data = JSON.stringify({
        paper_id: paperId
    })
    $.ajax({
        type: "delete",
        url: `api/paper?paper_id=${paperId}`,
        contentType: "application/json",
        async: false,
        success: () => success = true
    });
    return success
}

export default DeleteRepo;
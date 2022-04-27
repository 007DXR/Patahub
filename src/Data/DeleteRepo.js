import $ from 'jquery'

async function DeleteRepo(paperId) {
    let success = false
    const data = JSON.stringify({
        paper_id: paperId
    })
    await $.ajax({
        type: "delete",
        url: `/api/paper?paper_id=${paperId}`,
        contentType: "application/json",
        success: () => success = true
    });
    return success
}

export default DeleteRepo;
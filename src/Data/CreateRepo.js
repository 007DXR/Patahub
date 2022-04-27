import $ from 'jquery'

async function CreateRepo(paperName, paperLink, paperAbstract) {
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
        success: (data) => res = data
    });
    return res
}

export default CreateRepo
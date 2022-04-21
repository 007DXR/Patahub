import $ from 'jquery';


export async function searchRepositories(paper_id,title,dataset_id) {
    return require('./demo').getAllRepositories();
    return $.get('/api/paper', {
        paper_id,
        title,
        dataset_id
    } )
    .then((data) => {
        return data.papers;
    });
}

export async function getAllRepositories() {
    return searchRepositories(null,null,null);
}

export async function getRepositoryInfo() {
    return $.get('/api/getpaperlist',
        { version: "$api版本", username: "tester"} );
}
import $ from 'jquery';


export async function searchRepositories(options) {
    //return require('./demo').getAllRepositories();
    return $.get('/api/paper', options);
}

export async function getAllRepositories() {
    return searchRepositories(null, null, null);
}

export async function getRepositoryInfo() {
    return $.get('/api/getpaperlist',
        { version: "$api版本", username: "tester" });
}
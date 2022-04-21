import $ from 'jquery';

export async function getAllRepositories() {
    return $.get('/api/paper', {} )
    .then((data) => {
        return data.papers;
    });
}
export async function getRepositoryInfo() {
    return $.get('/api/getpaperlist',
        { version: "$api版本", username: "tester"} );
}
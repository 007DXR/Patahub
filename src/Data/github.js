import $ from 'jquery';

export async function getGithubRepoInfo(ownerName, repoName){
    return $.get(`https://api.github.com/repos/${ownerName}/${repoName}`);
}
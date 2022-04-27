import $ from 'jquery';
import { useCallback } from 'react';

export async function getGithubRepoInfo(ownerName, repoName){
    return $.get(`https://api.github.com/repos/${ownerName}/${repoName}`);
}
export async function getGithubRawContent(setLink, link){
    const [a,b] = parseGithubLink(setLink);
    if(link.slice(0,5) !== '/blob') throw 'invalid link' + link;
    link=link.slice(5);
    return $.get(`https://raw.githubusercontent.com/${a}/${b}/${link}`);
}
export function parseGithubLink(src){
    const regex = /https\:\/\/github\.com\/(.*?)\/(.*)$/i;
    const matchInfo = src.match(regex);
    if(matchInfo) return [matchInfo[1],matchInfo[2].split('/')[0]];
    else throw 'Invalid link' + src;
}
import $ from 'jquery';
import { useCallback } from 'react';

export async function getGithubRepoInfo(ownerName, repoName){
    return $.get(`https://api.github.com/repos/${ownerName}/${repoName}`);
}
export async function getGithubRawContent(setLink, link){
    const [a,b] = parseGithubLink(setLink);
    if(link.slice(0,6) == '/blob/'){
        link=link.slice(6);
        return $.get(`https://raw.githubusercontent.com/${a}/${b}/${link}`);
    }else if(link.slice(0,6) == '/tree/'){
        link=link.slice(6);
        link=link.slice(link.indexOf('/')+1);
        return $.get(`https://api.github.com/repos/${a}/${b}/contents/${link}`);
    }
}
export function parseGithubLink(src){
    const regex = /https\:\/\/github\.com\/(.*?)\/(.*)$/i;
    const matchInfo = src.match(regex);
    if(matchInfo) return [matchInfo[1],matchInfo[2].split('/')[0]];
    else throw 'Invalid link';
}
export function splitGithubLink(src){
    const regex = /https\:\/\/github\.com\/(.*?)\/(.*?)\/(.*)$/i;
    const matchInfo = src.match(regex);
    if(matchInfo) return [matchInfo[1],matchInfo[2],matchInfo[3]];
    else return "error";
}

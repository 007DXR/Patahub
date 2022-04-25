import $ from 'jquery';
import { useLocation } from 'react-router-dom';


export function useQuery() {
    const { search } = useLocation();
    return Object.fromEntries(
        search.slice(1).split('&').map((kv)=>{
            let arr=kv.split('=');
            return [arr[0], decodeURIComponent(arr[1])];
        }))
}

export async function searchAll(api_name, options) {
    return $.get('/api/'+api_name, options);
}

export async function searchRepositories(options) {
    return $.get('/api/paper', options);
}

export async function getAllRepositories() {
    return searchRepositories(null, null, null);
}

export async function getRepositoryInfo() {
    return $.get('/api/getpaperlist',
        { version: "$api版本", username: "tester" });
}
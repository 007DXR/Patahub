const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function getAllRepositories(){
    await sleep(Math.round(Math.random()*2000));
    return ['paper','paper2','paper3'];
}

export async function getRepositoryInfo(repoName){
    await sleep(Math.round(Math.random()*2000));
    return {
        paperTitle: 'This is a paper named ' + repoName,
        paperAbstract: repoName + "那么， 爱迪生在不经意间这样说过，失败也是我需要的，它和成功对我一样有价值。这似乎解答了我的疑惑。 就我个人来说，软件工程对我的意义，不能不说非常重大。 一般来说， 黑塞在不经意间这样说过，有勇气承担命运这才是英雄好汉。我希望诸位也能好好地体会这句话。 从这个角度来看， 这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。 既然如何， 了解清楚软件工程到底是一种怎么样的存在，是解决一切问题的关键。 吉格·金克拉说过一句富有哲理的话，如果你能做梦，你就能实现它。我希望诸位也能好好地体会这句话。 软件工程因何而发生？ 了解清楚软件工程到底是一种怎么样的存在，是解决一切问题的关键。 既然如何， 我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。 佚名说过一句富有哲理的话，感激每一个新的挑战，因为它会锻造你的意志和品格。这不禁令我深思。",
        dataSetLink: ['https://github.com/jiweibo/ImageNet']
    };
}

export async function getRCDList(repoName){
    await sleep(Math.round(Math.random()*2000));
    return [
    {
        resultLink: 'figure1',
        codeLinks: [`https://www.github.com/${repoName}/xxxxxcode`],
        datasetLinks: [`https://www.github.com/${repoName}/xxxxxdataset`],
    },{
        resultLink: 'figure2',
        codeLinks: [`https://www.github.com/${repoName}/xyfffyycode`,`https://www.github.com/${repoName}/xyyaqqyycode`],
        datasetLinks: [`https://www.github.com/${repoName}/xxyyyydataset`,`https://www.github.com/${repoName}/xxyfdsafydataset`,`https://www.github.com/${repoName}/xxwwwwydataset`,],
    },];
}


export default {getAllRepositories, getRepositoryInfo};
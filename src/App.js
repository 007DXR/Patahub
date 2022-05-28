import React, { useContext, useEffect, useState } from 'react';
import NavBar from './NavBar.js';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import AllRepositories from './Pages/AllRepositories/AllRepositories.js'
import RepositoryInfo from './Pages/RepositoryInfo/RepositoryInfo.js'
import RCDInfo from './Pages/RCDInfo/RCDInfo.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CreateRepoButton, CreateRepoForm } from './Pages/AllRepositories/CreateRepo.js';
import UserHomepage from './Pages/UserHomepage/UserHomepage.js';
import Search from './Pages/Search/Search.js'
import AdvancedSearch from './Pages/Search/AdvancedSearch.js'
import ReactMarkdown from 'react-markdown'
import 'highlight.js/styles/default.css';
import CreateDatasetPage from './Pages/RepositoryInfo/CreateDatasetPage.js';
import initAuth from './Pages/Utilities/auth.js';
import { validateUser } from './Data/User.js';


function App() {
    const [UserInfo, setUserInfo] = useState({
        userName: undefined,
        loading: true,
    });
    initAuth([UserInfo, setUserInfo]);
    useEffect(() => {
        try{
            let saved = JSON.parse(window.localStorage.getItem('UserInfo'));
            if(Object.prototype.toString.call(saved) == "[object Object]"){
                let newUserInfo = saved;
                newUserInfo.loading = false;
                validateUser(saved, setUserInfo).then((data, err) => {
                    if(data){
                        newUserInfo.userName = data.user_name;
                        newUserInfo.userId = data.user_id;
                        newUserInfo.userEmail = data.user_email;
                    }else newUserInfo = {
                        userName: undefined,
                    };
                    setUserInfo(newUserInfo);
                }, error=>setUserInfo({loading: false}))
            }else setUserInfo({loading: false});
        }catch(err){
            setUserInfo({loading: false});
        }
    }, []);
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/advancedSearch" element={<NavBar disableSearchbar/>} />
                    <Route path="/*" element={<NavBar/>}/>
                    <Route path="/repositoryInfo/:repoName" element={<NavBar deleteRepoButton/>} />
                </Routes>
                <Routes>
                    <Route path="/" element={<AllRepositories />} />
                    <Route path="/createRepo" element={<CreateRepoForm />} />
                    <Route path="/updateRepo/:paper_id" element={<CreateRepoForm update={true} />} />
                    <Route path="/createDataset" element={<CreateDatasetPage />} />
                    <Route path="/repositoryInfo/:repoName" element={<RepositoryInfo />} />
                    <Route path="/RCDInfo/:repoName/:RCDId" element={<RCDInfo />} />
                    <Route path="/search/:op" element={<Search />} />
                    <Route path="/UserHomepage/:userName" element={<UserHomepage />} />
                    <Route path="/advancedSearch" element={<AdvancedSearch />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

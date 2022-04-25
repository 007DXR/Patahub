import React from 'react';
import NavBar from './NavBar.js';
import { BrowserRouter, Routes , Route, } from "react-router-dom";
import AllRepositories from './Pages/AllRepositories/AllRepositories.js'
import RepositoryInfo from './Pages/RepositoryInfo/RepositoryInfo.js'
import RCDInfo from './Pages/RCDInfo/RCDInfo.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateRepoComponent from './Pages/AllRepositories/CreateRepo.js';
import UserHomepage from './Pages/UserHomepage/UserHomepage.js';
import Search from './Pages/Search/Search.js'
import AdvancedSearch from './Pages/Search/AdvancedSearch.js'

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/advancedSearch" element={<NavBar disableSearchbar/>} />
                    <Route path="/" element={<NavBar more={[<CreateRepoComponent/>]}/>} />
                    <Route path="/*" element={<NavBar />} />
                </Routes>
                <Routes>
                    <Route path="/" element={<AllRepositories />} />
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

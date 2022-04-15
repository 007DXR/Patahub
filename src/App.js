import React from 'react';
import NavBar from './NavBar.js';
import { BrowserRouter, Routes , Route, } from "react-router-dom";
import AllRepositories from './Pages/AllRepositories/AllRepositories.js'
import RepositoryInfo from './Pages/RepositoryInfo/RepositoryInfo.js'
import './App.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<AllRepositories />} />
                    <Route path="/repositoryInfo/:repoName" element={<RepositoryInfo />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

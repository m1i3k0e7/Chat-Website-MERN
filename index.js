import { HashRouter, Route, Routes } from 'react-router-dom';
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import MainPage from './pages/MainPage';
import SearchPage from './pages/Search';
import ProfilePage from './pages/Profile';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { UserContextProvider } from './component/contexts/UserContext';

axios.defaults.baseURL = "http://localhost:8080/apis";
axios.defaults.withCredentials = true;

const App = () => {
    return (
        <div>
            <UserContextProvider>
                <Routes>
                    <Route path="/" element={<LoginPage/>} />
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path='/main' element={<MainPage/>}/>
                    <Route path='/search' element={<SearchPage/>} />
                    <Route path='/profile' element={<ProfilePage/>} />
                </Routes>
            </UserContextProvider>
        </div>
    )
};

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <App /> 
        </HashRouter>
    </React.StrictMode>,
    document.getElementById("root"));
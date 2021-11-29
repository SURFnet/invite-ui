import React from 'react';
import ReactDOM from 'react-dom';
import {render} from "react-dom";
import './index.scss';
import App from './App';
import {Router} from "react-router-dom";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App/>}>
                    {/*<Route index element={<Home/>}/>*/}
                    {/*<Route path="teams" element={<Teams/>}>*/}
                    {/*    <Route path=":teamId" element={<Team/>}/>*/}
                    {/*    <Route path="new" element={<NewTeamForm/>}/>*/}
                    {/*    <Route index element={<LeagueStandings/>}/>*/}
                    {/*</Route>*/}
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("app")
);

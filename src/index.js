import React from 'react';
import {render} from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./locales/en";

import I18n from "i18n-js";

I18n.locale = "en";

render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<App/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("app")
);

import './App.scss';
import {me, oauth} from "./api/api";
import {useEffect, useState} from "react";
import {getTokensFrontChannel} from "./api/frontChannelTokenRequest";
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {addIcons} from "./img/IconLibrary";
import Home from "./pages/Home";
import Header from "./components/Header";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import NotFound from "./pages/NotFound";
import InstitutionForm from "./pages/InstitutionForm";
import Flash from "./flash/Flash";
import InstitutionDetail from "./pages/InstitutionDetail";

addIcons();

const App = () => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const options = sessionStorage.getItem("options");
        const accessToken = sessionStorage.getItem("accessToken");
        const urlSearchParams = new URLSearchParams(window.location.search);
        const inAuthRedirect = urlSearchParams.has("code");
        if (!accessToken && !options) {
            sessionStorage.setItem("path", `${window.location.pathname}${window.location.search}`);
            oauth().then(r => {
                sessionStorage.setItem("options", JSON.stringify(r));
                window.location.href = r.authorizationUrl;
            })
        } else if (inAuthRedirect && options) {
            const optionsDict = JSON.parse(options);
            optionsDict.code = urlSearchParams.get("code")
            getTokensFrontChannel(optionsDict).then(r => {
                sessionStorage.setItem("accessToken", r.access_token);
                sessionStorage.setItem("refreshToken", r.refresh_token);
                sessionStorage.setItem("clientId", optionsDict.clientId);
                sessionStorage.setItem("tokenUrl", optionsDict.tokenUrl);
                sessionStorage.removeItem("options");
                me()
                    .then(user => {
                        sessionStorage.setItem("user", JSON.stringify(user));
                        navigate(sessionStorage.getItem("path"), {replace: true});
                        setLoading(false);
                    })
                    .catch(() => {
                        //Unknown user who has received an invitation
                        sessionStorage.removeItem("user");
                        navigate(sessionStorage.getItem("path"), {replace: true});
                        setLoading(false);
                    });
            });
        } else {
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return null; // render null when app is not ready yet
    }
    const user = JSON.parse(sessionStorage.getItem("user"));
    return (
        <div className="invites">
            <div className="container">
                <Flash/>
                <Header user={user}/>
                {user && <Routes>
                    <Route path="/" element={<Navigate replace to="home"/>}/>
                    <Route path="home">
                        <Route path=":tab" element={<Home user={user}/>}/>
                        <Route path="" element={<Home user={user}/>}/>
                    </Route>
                    <Route path="institution/:institutionId" element={<InstitutionForm user={user}/>}/>
                    <Route path="institution-detail/:institutionId">
                        <Route path=":tab" element={<InstitutionDetail user={user}/>}/>
                        <Route path="" element={<InstitutionDetail user={user}/>}/>
                    </Route>
                    <Route path="new-" element={<Applications/>}/>
                    <Route path="applications" element={<Applications/>}/>
                    <Route path="applications/:applicationId" element={<ApplicationDetail/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>}
                {!user && <Routes>
                    <Route path="invitation/:hash" element={<ApplicationDetail/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>}
            </div>
        </div>
    );
}

export default App;

import './App.scss';
import {me, oauth} from "./api/api";
import {useEffect, useState} from "react";
import {getTokensFrontChannel} from "./api/frontChannelTokenRequest";
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {addIcons} from "./img/IconLibrary";
import Home from "./pages/Home";
import Header from "./components/Header";
import ApplicationDetail from "./pages/ApplicationDetail";
import NotFound from "./pages/NotFound";
import InstitutionForm from "./pages/InstitutionForm";
import Flash from "./flash/Flash";
import InstitutionDetail from "./pages/InstitutionDetail";
import ApplicationForm from "./pages/ApplicationForm";
import RoleForm from "./pages/RoleForm";
import NewInvitation from "./pages/NewInvitation";
import Profile from "./pages/Profile";
import Invitation from "./pages/Invitation";
import User from "./pages/User";
import InvitationDetail from "./pages/InvitationDetail";
import {institutionMembershipsWithNoAup} from "./utils/aup";
import Aup from "./pages/Aup";
import {isEmpty} from "./utils/forms";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import SCIMFailureDetail from "./pages/SCIMFailureDetail";
import InstitutionGuest from "./pages/InstitutionGuest";

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
            });
        } else if (inAuthRedirect && options) {
            const optionsDict = JSON.parse(options);
            optionsDict.code = urlSearchParams.get("code")
            getTokensFrontChannel(optionsDict).then(r => {
                sessionStorage.setItem("accessToken", r.access_token);
                sessionStorage.setItem("refreshToken", r.refresh_token);
                sessionStorage.setItem("clientId", optionsDict.clientId);
                sessionStorage.setItem("tokenUrl", optionsDict.tokenUrl);
                sessionStorage.removeItem("options");
                const path = sessionStorage.getItem("path") || "/";
                me()
                    .then(user => {
                        sessionStorage.setItem("user", JSON.stringify(user));
                        const membershipsWithoutAup = institutionMembershipsWithNoAup(user);
                        const navigationPath = isEmpty(membershipsWithoutAup) ? path : "/aup";
                        navigate(navigationPath, {replace: true});
                        setLoading(false);
                    })
                    .catch(() => {
                        //Unknown user who has received an invitation
                        sessionStorage.removeItem("user");
                        navigate(path, {replace: true});
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
                    <Route path="profile" element={<Profile user={user}/>}/>
                    <Route path="aup" element={<Aup user={user}/>}/>
                    <Route path="invitations" element={<Invitation user={user}/>}/>
                    <Route path="institution/:institutionId" element={<InstitutionForm user={user}/>}/>
                    <Route path="institution-detail/:institutionId">
                        <Route path=":tab" element={<InstitutionDetail user={user}/>}/>
                        <Route path="" element={<InstitutionDetail user={user}/>}/>
                    </Route>
                    <Route path="institution-guest" element={<InstitutionGuest user={user}/>}/>
                    <Route path="application/:institutionId/:applicationId" element={<ApplicationForm user={user}/>}/>
                    <Route path="application-detail/:institutionId/:applicationId">
                        <Route path=":tab" element={<ApplicationDetail user={user}/>}/>
                        <Route path="" element={<ApplicationDetail user={user}/>}/>
                    </Route>
                    <Route path="role/:institutionId/:applicationId/:roleId" element={<RoleForm user={user}/>}/>
                    <Route path="new-invitation/:institutionId" element={<NewInvitation user={user}/>}/>
                    <Route path="user-detail/:userId/:institutionId" element={<User/>}/>
                    <Route path="invitation-detail/:invitationId" element={<InvitationDetail/>}/>
                    <Route path="scim-failure-detail/:institutionId/:failureId" element={<SCIMFailureDetail user={user}/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>}
                {!user && <Routes>
                    <Route path="invitations" element={<Invitation/>}/>
                    <Route path="*" element={<Landing/>}/>
                </Routes>}
            </div>
            <Footer/>
        </div>
    );
}

export default App;

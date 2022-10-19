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
import RefreshRoute from "./pages/RefreshRoute";
import {cookieStorage} from "./utils/storage";

addIcons();

const App = () => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const options = cookieStorage.getItem("options");
        const accessToken = cookieStorage.getItem("accessToken");
        const urlSearchParams = new URLSearchParams(window.location.search);
        const inAuthRedirect = urlSearchParams.has("code");
        if (!accessToken && !options) {
            const previousPath = cookieStorage.getItem("path");
            if (!previousPath) {
                cookieStorage.setItem("path", `${window.location.pathname}${window.location.search}`);
            }
            oauth().then(r => {
                cookieStorage.setItem("options", JSON.stringify(r));
                window.location.href = r.authorizationUrl;
            });
        } else if (inAuthRedirect && options) {
            const optionsDict = JSON.parse(options);
            optionsDict.code = urlSearchParams.get("code");
            getTokensFrontChannel(optionsDict)
                .then(r => {
                cookieStorage.setItem("accessToken", r.access_token);
                cookieStorage.setItem("refreshToken", r.refresh_token);
                cookieStorage.setItem("clientId", optionsDict.clientId);
                cookieStorage.setItem("tokenUrl", optionsDict.tokenUrl);
                cookieStorage.removeItem("options");
                const path = cookieStorage.getItem("path") || "/";
                me()
                    .then(user => {
                        cookieStorage.setItem("user", JSON.stringify(user));
                        const membershipsWithoutAup = institutionMembershipsWithNoAup(user);
                        const navigationPath = isEmpty(membershipsWithoutAup) ? path : "/aup";
                        navigate(navigationPath, {replace: true});
                        setLoading(false);
                    })
                    .catch(() => {
                        //Unknown user who has received an invitation
                        cookieStorage.removeItem("user");
                        navigate(path, {replace: true});
                        setLoading(false);
                    });
            })
        } else {
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return null; // render null when app is not ready yet
    }

    const userJson = cookieStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
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
                    <Route path="user-detail/:userId/:institutionId" element={<User user={user}/>}/>
                    <Route path="invitation-detail/:invitationId" element={<InvitationDetail/>}/>
                    <Route path="scim-failure-detail/:institutionId/:failureId" element={<SCIMFailureDetail user={user}/>}/>
                    <Route path="refresh-route/:path" element={<RefreshRoute/>}/>
                    <Route path="test-landing" element={<Landing/>}/>
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

import './App.scss';
import {oauth, me} from "./api/api";
import {useEffect, useState} from "react";
import {getTokensFrontChannel} from "./api/frontChannelTokenRequest";
import {BrowserRouter as Router, Route, useNavigate} from 'react-router-dom';


const App = () => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const options = sessionStorage.getItem("options");
        const accessToken = sessionStorage.getItem("accessToken");
        const urlSearchParams = new URLSearchParams(window.location.search);
        const inAuthRedirect = urlSearchParams.has("code");
        if (!accessToken && !options) {
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
                me().then(user => {
                    sessionStorage.setItem("user", JSON.stringify(user));
                    navigate('/user', {replace: true});
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
    const token = sessionStorage.getItem("accessToken");
    let user = sessionStorage.getItem("user");
    return (
        <div className="content">
            {/*<Router>*/}
            {/*    <Route exact path="/" component={Hello} />*/}
            {/*    <Route path="/goodbye" component={Goodbye} />*/}
            {/*</Router>            */}
            {token && <div>{token}</div>}
            {user && <div>{user}</div>}
        </div>
    );
}

export default App;

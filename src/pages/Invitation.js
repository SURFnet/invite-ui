import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import I18n from "i18n-js";
import "./Invitation.scss";
import Button from "../components/Button";
import {acceptInvitation, invitationByHash, me} from "../api/api";
import CheckBox from "../components/CheckBox";
import Spinner from "../components/Spinner";


const Invitation = () => {

    const navigate = useNavigate();

    const [agreed, setAgreed] = useState(false);
    const [invitation, setInvitation] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const h = urlSearchParams.get("h");
        invitationByHash(h).then(res => {
            setInvitation({...res, hash: h, status: "ACCEPTED"});
            setLoading(false);
        }).catch(() => navigate("/404"));
    }, [navigate]);

    const proceed = () => {
        acceptInvitation(invitation).then(() => {
            me()
                .then(user => {
                    sessionStorage.setItem("user", JSON.stringify(user));
                    navigate("/home", {replace: true});
                })
        });
    }

    if (loading) {
        return <Spinner/>;
    }
    return (
        <div className="invitation-container">
            <div className="invitation">
                <h2>{I18n.t("aup.hi", {name: invitation.email})}</h2>
                <div className="disclaimer">
                    <p dangerouslySetInnerHTML={{__html: I18n.t("aup.info")}}/>
                </div>
                {invitation.institution.aupUrl &&
                <div>
                    <h2 dangerouslySetInnerHTML={{__html: I18n.t("aup.title")}}/>
                    <p className=""
                       dangerouslySetInnerHTML={{__html: I18n.t("aup.disclaimer", {url: invitation.institution.aupUrl})}}/>
                    <div className="terms">
                        <CheckBox name="aup" value={agreed} info={I18n.t("aup.agreeWithTerms")}
                                  onChange={() => setAgreed(!agreed)}/>
                    </div>
                </div>}
                <section className={"actions"}>
                    <Button className="proceed" onClick={proceed}
                            txt={I18n.t("aup.onward")} disabled={!agreed && invitation.institution.aupUrl}/>
                </section>

            </div>
        </div>
    )
}


export default Invitation;
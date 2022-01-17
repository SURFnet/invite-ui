import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import I18n from "i18n-js";
import "./Invitation.scss";
import Button from "../components/Button";
import {acceptInvitation, invitationByHash, me} from "../api/api";
import CheckBox from "../components/CheckBox";
import Spinner from "../components/Spinner";
import {isEmpty} from "../utils/forms";


const Invitation = ({user}) => {

    const navigate = useNavigate();

    const [agreed, setAgreed] = useState(false);
    const [showAup, setShowAup] = useState(true);
    const [invitation, setInvitation] = useState({});
    const [loading, setLoading] = useState(true);
    const [emailEqualityConflict, setEmailEqualityConflict] = useState(false);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const h = urlSearchParams.get("h");
        invitationByHash(h).then(res => {
            setInvitation({...res, hash: h, status: "ACCEPTED"});
            setEmailEqualityConflict(res.emailEqualityConflict);
            if (!isEmpty(user)) {
                const aup = user.aups.find(aup => aup.version === res.institution.aupVersion && aup.institutionId === res.institution.id);
                setShowAup(isEmpty(aup));
                setAgreed(!isEmpty(aup))
            }
            setLoading(false);
        }).catch(() => navigate("/404"));
    }, [navigate, user]);

    const proceed = () => {
        acceptInvitation(invitation).then(() => {
            me()
                .then(user => {
                    sessionStorage.setItem("user", JSON.stringify(user));
                    const newRoles = invitation.userRoles.map(userRole => ({
                        applicationName: userRole.role.applicationName,
                        roleName: userRole.role.name
                    }));
                    if (!isEmpty(newRoles)) {
                        const invitationRoles = {institutionId: invitation.roles[0].role.institutionId, newRoles: newRoles}
                        sessionStorage.setItem("invitationRoles", JSON.stringify(invitationRoles));
                    }
                    navigate(`/home`, {replace: true});
                })
        }).catch(e => {
            if (e.response && e.response.status === 409) {
                setEmailEqualityConflict(true);
            }
        });
    }

    const roleInformation = () => {
        return invitation.roles
            .map(role => `<strong>${role.role.name}</strong> (application <strong>${role.role.applicationName}</strong>)`)
            .join(", ");
    }

    const roleCardinality = () => {
        return I18n.t(`aup.${invitation.roles.length > 1 ? "multipleRoles" : "singleRole"}`)
    }

    if (loading) {
        return <Spinner/>;
    }

    return (
        <div className="invitation-container">
            <div className="invitation">
                <h2>{I18n.t("aup.hi", {name: invitation.email})}</h2>
                {(!emailEqualityConflict && invitation.roles.length > 0) && <div className="invitation-info">
                    <p dangerouslySetInnerHTML={{
                        __html: I18n.t("aup.role", {
                            cardinality: roleCardinality(),
                            roles: roleInformation(),
                            name: invitation.institution.displayName
                        })
                    }}/>
                </div>}
                {(!emailEqualityConflict && invitation.roles.length === 0) && <div className="invitation-info">
                    <p dangerouslySetInnerHTML={{
                        __html: I18n.t("aup.noRoles", {
                            name: invitation.institution.displayName
                        })
                    }}/>
                </div>}
                {(!emailEqualityConflict && isEmpty(user)) && <div className="disclaimer">
                    <p dangerouslySetInnerHTML={{__html: I18n.t("aup.info")}}/>
                </div>}
                {(invitation.institution.aupUrl && !emailEqualityConflict && showAup) &&
                <div>
                    <h2 dangerouslySetInnerHTML={{__html: I18n.t("aup.title")}}/>
                    <p className=""
                       dangerouslySetInnerHTML={{__html: I18n.t("aup.disclaimer", {url: invitation.institution.aupUrl})}}/>
                    <div className="terms">
                        <CheckBox name="aup" value={agreed} info={I18n.t("aup.agreeWithTerms")}
                                  onChange={() => setAgreed(!agreed)}/>
                    </div>
                </div>}
                {!emailEqualityConflict && <section className={"actions"}>
                    <Button className="proceed" onClick={proceed}
                            txt={I18n.t("aup.onward")} disabled={!agreed && invitation.institution.aupUrl}/>
                </section>}
                {emailEqualityConflict && <section className={"error"}>
                    <p>{I18n.t("aup.emailEqualityConflict")}</p>
                </section>}

            </div>
        </div>
    )
}


export default Invitation;
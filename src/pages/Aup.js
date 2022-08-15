import "./Aup.scss";
import {institutionMembershipsWithNoAup} from "../utils/aup";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {acceptAups, me} from "../api/api";
import I18n from "i18n-js";
import Spinner from "../components/Spinner";
import CheckBox from "../components/CheckBox";
import Button from "../components/Button";
import {cookieStorage} from "../utils/storage";
import DOMPurify from "dompurify";

const Aup = ({user}) => {

    const navigate = useNavigate();

    const [agreed, setAgreed] = useState({});
    const [membershipsWithoutAup, setMembershipsWithoutAup] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const members = institutionMembershipsWithNoAup(user);
        setMembershipsWithoutAup(members);
        setAgreed(members.reduce((acc, membership) => {
            acc[membership.id] = false;
            return acc;
        }, {}))
        setLoading(false);
    }, [navigate, user]);

    const proceed = () => {
        acceptAups(membershipsWithoutAup).then(() => {
            me()
                .then(user => {
                    cookieStorage.setItem("user", JSON.stringify(user));
                    const path = cookieStorage.getItem("path") || "/";
                    navigate(path, {replace: true});
                });
        });
    }

    const allAgreed = () => Object.values(agreed).every(val => val);

    const agreeWithTerms = membershipId => () => {
        setAgreed({...agreed, [membershipId]: !agreed[membershipId]})
    }

    if (loading) {
        return <Spinner/>;
    }

    return (
        <div className="aup-container">
            <div className="aup">
                <h2>{I18n.t("aup.hi", {name: user.givenName})}</h2>
                <h2 dangerouslySetInnerHTML={{__html: I18n.t("aup.title")}}/>
                {membershipsWithoutAup.map(membership => <div key={membership.id}>
                    <p dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(I18n.t("aup.disclaimerChanged", {
                            name: membership.institution.displayName,
                            url: membership.institution.aupUrl
                        }))
                    }}/>
                    <div className="terms">
                        <CheckBox name={`aup_${membership.id}`}
                                  value={agreed[membership.id]}
                                  info={I18n.t("aup.agreeWithTerms")}
                                  onChange={agreeWithTerms(membership.id)}/>
                    </div>
                </div>)}
                <section className={"actions"}>
                    <Button className="proceed" onClick={proceed}
                            txt={I18n.t("aup.onward")} disabled={!allAgreed()}/>
                </section>
            </div>
        </div>
    )
}

export default Aup;
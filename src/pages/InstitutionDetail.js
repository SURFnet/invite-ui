import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Applications from "../entities/Applications";
import UnitHeader from "../components/UnitHeader";
import {institutionById} from "../api/api";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import Users from "../entities/Users";
import Roles from "../entities/Roles";
import {BreadCrumb} from "../components/BreadCrumb";

const InstitutionDetail = ({user}) => {

    const navigate = useNavigate();
    const {institutionId, tab = "institutions"} = useParams();
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(tab);
    const [institution, setInstitution] = useState(tab);
    const tabs = [];

    useEffect(() => {
        institutionById(institutionId).then(res => {
            setInstitution(res);
            setLoading(false);
        })
    }, [institutionId]);

    if (loading) {
        return <Spinner/>
    }

    if (isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user)) {
        tabs.push(
            <div key="applications"
                 name="applications"
                 label={I18n.t("home.tabs.applications")}
                 icon={<FontAwesomeIcon icon="mobile-alt"/>}>
                <Applications user={user} institution={institution}/>
            </div>)
    }
    if (isAllowed(AUTHORITIES.INVITER, user)) {
        tabs.push(<div key="users"
                       name="users"
                       label={I18n.t("home.tabs.users")}
                       icon={<FontAwesomeIcon icon="user"/>}>
            <Users institution={institution}/>
        </div>)
    }
    if (false && isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user)) {
        tabs.push(<div key="roles"
                       name="roles"
                       label={I18n.t("home.tabs.roles")}
                       icon={<FontAwesomeIcon icon="hat-cowboy"/>}>
            <Roles institutionId={institutionId}/>
        </div>)
    }

    const tabChanged = name => {
        setCurrentTab(name);
        navigate(`/institution-detail/${institutionId}/${name}`, {replace: true});
    }

    return (
        <div className="institution-detail">
            <BreadCrumb paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {value: institution.displayName}
            ]}/>
            <UnitHeader>
                <div className="info">
                    <h2>{`${I18n.t("institutions.object")} ${institution.displayName}`}</h2>
                    <p className="attribute">{I18n.t("institutions.entityId")}</p>
                    <p>{institution.entityId}</p>
                    <p className="attribute">{I18n.t("institutions.homeInstitution")}</p>
                    <p>{institution.homeInstitution}</p>
                </div>
                <div className="actions">
                    <Button txt={I18n.t("forms.edit")} onClick={() => navigate(`/institution/${institution.id}`)}/>
                </div>
            </UnitHeader>
            <Tabs activeTab={currentTab} tabChanged={tabChanged}>
                {tabs}
            </Tabs>
        </div>
    );

}
export default InstitutionDetail;
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import UnitHeader from "../components/UnitHeader";
import {applicationById} from "../api/api";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import Roles from "../entities/Roles";
import Users from "../entities/Users";
import {BreadCrumb} from "../components/BreadCrumb";

const ApplicationDetail = ({user}) => {

    const navigate = useNavigate();
    const {institutionId, applicationId, tab = "roles"} = useParams();

    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(tab);
    const [application, setApplication] = useState({});
    const tabs = [];

    useEffect(() => {
        applicationById(applicationId).then(res => {
            setApplication(res);
            setLoading(false);
        })
    }, [applicationId]);


    if (isAllowed(AUTHORITIES.INVITER, user)) {
        tabs.push(
            <div key="roles"
                 name="roles"
                 label={I18n.t("home.tabs.roles")}
                 icon={<FontAwesomeIcon icon="hat-cowboy"/>}>
                <Roles application={application} institutionId={institutionId}/>
            </div>)
        tabs.push(
            <div key="users"
                 name="users"
                 label={I18n.t("home.tabs.users")}
                 icon={<FontAwesomeIcon icon="user"/>}>
                <Users application={application} institutionId={institutionId}/>
            </div>)
    }

    const tabChanged = name => {
        setCurrentTab(name);
        navigate(`/application-detail/${institutionId}/${applicationId}/${name}`, {replace: true});
    }

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className="application-detail">
            <BreadCrumb paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {path: `/institution-detail/${institutionId}`, value: application.institutionName},
                {value: application.displayName}
            ]}/>

            <UnitHeader>
                <div className="info">
                    <h2>{`${I18n.t("applications.object")} ${application.displayName}`}</h2>
                    <p className="attribute">{I18n.t("applications.entityId")}</p>
                    <p>{application.entityId}</p>
                    {application.landingPage && <p className="attribute">{I18n.t("applications.landingPage")}</p>}
                    {application.landingPage && <p>{application.landingPage}</p>}
                </div>
                <div className="actions">
                    <Button txt={I18n.t("forms.edit")}
                            onClick={() => navigate(`/application/${institutionId}/${application.id}`)}/>
                </div>
            </UnitHeader>
            <Tabs activeTab={currentTab} tabChanged={tabChanged}>
                {tabs}
            </Tabs>
        </div>
    );

}
export default ApplicationDetail;
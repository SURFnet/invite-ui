import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Applications from "../entities/Applications";
import UnitHeader from "../components/UnitHeader";
import {applicationById} from "../api/api";
import Spinner from "../components/Spinner";
import Button from "../components/Button";

const ApplicationDetail = ({user}) => {

    const navigate = useNavigate();
    const {applicationId, tab = "users"} = useParams();
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(tab);
    const [application, setApplication] = useState(tab);
    const tabs = [];

    useEffect(() => {
        applicationById(applicationId).then(res => {
            setApplication(res);
            setLoading(false);
        })
    }, [applicationId]);


    if (isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user)) {
        tabs.push(
            <div key="applications"
                 name="applications"
                 label={I18n.t("home.tabs.applications")}
                 icon={<FontAwesomeIcon icon="mobile-alt"/>}>
                <Applications user={user} applicationId={applicationId}/>
            </div>)
    }

    const tabChanged = name => {
        setCurrentTab(name);
        navigate(`/application-detail/${name}`, {replace: true});
    }

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className="application-detail">
            <UnitHeader>
                <div className="info">
                    <h2>{`${I18n.t("applications.object")} ${application.displayName}`}</h2>
                    <p className="attribute">{I18n.t("applications.entityId")}</p>
                    <p>{application.entityId}</p>
                    <p className="attribute">{I18n.t("applications.homeApplication")}</p>
                    <p>{application.homeApplication}</p>
                </div>
                <div className="actions">
                    <Button txt={I18n.t("forms.edit")} onClick={() => navigate(`/application/${application.id}`)}/>
                </div>
            </UnitHeader>
            <Tabs activeTab={currentTab} tabChanged={tabChanged}>
                {tabs}
            </Tabs>
        </div>
    );

}
export default ApplicationDetail;
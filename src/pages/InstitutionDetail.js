import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Applications from "../entities/Applications";
import UnitHeader from "../components/UnitHeader";
import {countSCIMFailuresByInstitution, incrementAup, institutionById} from "../api/api";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import Users from "../entities/Users";
import {BreadCrumb} from "../components/BreadCrumb";
import Invitations from "../entities/Invitations";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {setFlash} from "../flash/events";
import {isEmpty} from "../utils/forms";
import SCIMFailures from "../entities/SCIMFailures";

const InstitutionDetail = ({user}) => {

    const navigate = useNavigate();
    const {institutionId, tab = "institutions"} = useParams();

    const [loading, setLoading] = useState(true);
    const [institution, setInstitution] = useState({});
    const [currentTab, setCurrentTab] = useState(tab);
    const [scimFailureCount, setScimFailureCount] = useState(0);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmation, setConfirmation] = useState({});

    const tabs = [];

    useEffect(() => {
        const promises = [institutionById(institutionId)]
        const scimFailuresAllowed = isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId);
        if (scimFailuresAllowed) {
            promises.push(countSCIMFailuresByInstitution(institutionId));
        }
        Promise.all(promises).then(res => {
            setInstitution(res[0]);
            if (res[1]) {
                setScimFailureCount(res[1].count);
            }
            setLoading(false);
        })
    }, [institutionId, user]);

    if (loading) {
        return <Spinner/>
    }

    if (isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId)) {
        tabs.push(
            <div key="applications"
                 name="applications"
                 label={I18n.t("home.tabs.applications")}
                 icon={<FontAwesomeIcon icon="mobile-alt"/>}>
                <Applications user={user} institution={institution}/>
            </div>)
    }
    if (isAllowed(AUTHORITIES.INVITER, user, institutionId)) {
        tabs.push(<div key="users"
                       name="users"
                       label={I18n.t("home.tabs.users")}
                       icon={<FontAwesomeIcon icon="user"/>}>
            <Users institutionId={institution.id} user={user}/>
        </div>)
        tabs.push(
            <div key="invitations"
                 name="invitations"
                 label={I18n.t("home.tabs.invitations")}
                 icon={<FontAwesomeIcon icon="user-circle"/>}>
                <Invitations institutionId={institutionId} user={user}/>
            </div>)
    }
    if (isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId) && scimFailureCount > 0) {
        tabs.push(
            <div key="scimFailures"
                 name="scimFailures"
                 label={I18n.t("home.tabs.scimFailures")}
                 icon={<FontAwesomeIcon icon="exclamation-triangle"/>}>
                <SCIMFailures institution={institution}/>
            </div>)
    }

    const doIncrementAup = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doIncrementAup(false),
                warning: false,
                question: I18n.t("institutions.aup.confirmation")
            });
            setConfirmationOpen(true);
        } else {
            incrementAup(institution).then(() => {
                setConfirmationOpen(false);
                setFlash(I18n.t("institutions.aup.flash"));

            })
        }
    };


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
            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <UnitHeader>
                <div className="info">
                    <h2>{`${I18n.t("institutions.object")} ${institution.displayName}`}</h2>
                    <p className="attribute">{I18n.t("institutions.entityId")}</p>
                    <p>{institution.entityId}</p>
                    <p className="attribute">{I18n.t("institutions.homeInstitution")}</p>
                    <p>{institution.homeInstitution}</p>
                </div>
                {isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId) &&
                <div className="actions">
                    <Button txt={I18n.t("forms.edit")} onClick={() => navigate(`/institution/${institution.id}`)}/>
                    {!isEmpty(institution.aupUrl) &&
                    <Button txt={I18n.t("institutions.aup.increment")} onClick={() => doIncrementAup(true)}/>}
                </div>}
            </UnitHeader>
            <Tabs activeTab={currentTab} tabChanged={tabChanged}>
                {tabs}
            </Tabs>
        </div>
    );

}
export default InstitutionDetail;
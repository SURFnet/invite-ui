import React, {useEffect, useState} from "react";

import "react-datepicker/dist/react-datepicker.css";
import {deleteScimFailure, scimFailureById} from "../api/api";
import I18n from "i18n-js";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "./SCIMFailureDetail.scss"
import Spinner from "../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {BreadCrumb} from "../components/BreadCrumb";
import {setFlash} from "../flash/events";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {formatDate} from "../utils/date";

const SCIMFailureDetail = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [scimFailure, setScimFailure] = useState({});
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const {failureId, institutionId} = useParams();

    useEffect(() => {
        scimFailureById(failureId, institutionId).then(res => {
            setScimFailure(res);
            setLoading(false);
        }).catch(() => navigate("/404"));
    }, [navigate, failureId, institutionId])

    const doDelete = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDelete(false),
                warning: true,
                question: I18n.t("invitations.confirmation.delete")
            });
            setConfirmationOpen(true);
        } else {
            deleteScimFailure(failureId, institutionId).then(() => {
                setFlash(I18n.t("scimFailures.flash.deleted"));
                navigate(`/institution-detail/${institutionId}/scimFailures`);
            })
        }
    };

    // const doResend = showConfirmation => {
    //     if (showConfirmation) {
    //         setConfirmation({
    //             cancel: () => setConfirmationOpen(false),
    //             action: () => doResend(false),
    //             warning: false,
    //             question: I18n.t("scimFailures.confirmation.resend")
    //         });
    //         setConfirmationOpen(true);
    //     } else {
    //         resendScimFailure(failureId, institutionId).then(() => {
    //             setFlash(I18n.t("scimFailures.flash.resend"));
    //             navigate(`/institution-detail/${institutionId}/scimFailures`);
    //         })
    //     }
    // };

    const failureForm = () => (
        <>

            <InputField value={scimFailure.message}
                        name={I18n.t("scimFailures.message")}
                        className={"json large"}
                        multiline={true}
                        disabled={true}/>

            <InputField value={I18n.t(`scimFailures.api.${scimFailure.api}`)}
                        name={I18n.t("scimFailures.api.name")}
                        disabled={true}/>

            <InputField value={scimFailure.httpMethod}
                        name={I18n.t("scimFailures.uri")}
                        disabled={true}/>

            <InputField value={scimFailure.uri}
                        name={I18n.t("scimFailures.uri")}
                        disabled={true}/>

            {scimFailure.serviceProviderId && <InputField value={scimFailure.serviceProviderId}
                        name={I18n.t("scimFailures.serviceProviderId")}
                        disabled={true}/>}

            <InputField value={scimFailure.application.name}
                        name={I18n.t("scimFailures.application")}
                        disabled={true}/>

            <InputField value={formatDate(scimFailure.createdAt)}
                        name={I18n.t("scimFailures.createdAt")}
                        disabled={true}/>

            <section className="actions">
                <Button warningButton={true} txt={I18n.t("forms.delete")}
                        onClick={() => doDelete(true)}/>
                {/*<Button txt={I18n.t("invitations.resend")} onClick={() => doResend(true)}/>*/}
            </section>

        </>);

    if (loading) {
        return <Spinner/>
    }
    return (
        <div className="scim-failure-detail-form">
            <BreadCrumb
                paths={[
                    {path: "/", value: I18n.t("breadcrumbs.home")},
                    {
                        path: `/institution-detail/${institutionId}`,
                        value: scimFailure.application.institutionName
                    },
                    {
                        path: `/institution-detail/${institutionId}/scimFailures`,
                        value: I18n.t("scimFailures.path")
                    },
                    {value: I18n.t("scimFailures.failure")}
                ]}
                inForm={true}/>
            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <h2>{I18n.t("scimFailures.details")}</h2>
            {failureForm()}
        </div>
    )
};


export default SCIMFailureDetail;
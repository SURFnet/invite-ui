import React, {useEffect, useState} from "react";

import "react-datepicker/dist/react-datepicker.css";
import {deleteInvitation, invitationById, resendInvitation, updateInvitation} from "../api/api";
import I18n from "i18n-js";
import InputField from "../components/InputField";
import Button from "../components/Button";

import "./InvitationDetail.scss"
import DateField from "../components/DateField";
import SelectField from "../components/SelectField";
import Spinner from "../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {BreadCrumb} from "../components/BreadCrumb";
import CheckBox from "../components/CheckBox";
import {setFlash} from "../flash/events";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {futureDate, invitationRoleExpiryDate} from "../utils/date";

const InvitationDetail = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invitation, setInvitation] = useState({});
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const {invitationId} = useParams();

    useEffect(() => {
        invitationById(invitationId).then(res => {
            res.roleValues = res.roles.map(role => ({
                value: role.id,
                label: `${role.role.name} (${role.role.application.name})`
            }));
            res.expiryDate = new Date(res.expiryDate * 1000);
            setInvitation(res);
            setLoading(false);
        }).catch(() => navigate("/404"));
    }, [navigate, invitationId])

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
            deleteInvitation(invitation.id).then(() => {
                setFlash(I18n.t("invitations.flash.deleted"));
                navigate(`/institution-detail/${invitation.institution.id}/invitations`);
            })
        }
    };

    const doResend = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doResend(false),
                warning: false,
                question: I18n.t("invitations.confirmation.resend")
            });
            setConfirmationOpen(true);
        } else {
            resendInvitation({
                id: invitation.id,
                expiryDate: invitation.expiryDate,
                message: invitation.message,
            }).then(() => {
                setFlash(I18n.t("invitations.flash.resend"));
                navigate(`/institution-detail/${invitation.institution.id}/invitations`);
            })
        }
    };

    const doUpdate = () => {
        updateInvitation({
            id: invitation.id,
            expiryDate: invitation.expiryDate
        }).then(() => {
            setFlash(I18n.t("invitations.flash.updated"));
            navigate(`/institution-detail/${invitation.institution.id}/invitations`);
        })
    };

    const invitationForm = () => (
        <>
            <InputField value={invitation.email}
                        name={I18n.t("invitations.invitees")}
                        disabled={true}/>

            <InputField value={I18n.t(`users.authorities.${invitation.intendedAuthority}`)}
                        name={I18n.t("invitations.intendedAuthority")}
                        disabled={true}/>

            <CheckBox name={I18n.t("invitations.enforceEmailEquality")}
                      value={invitation.enforceEmailEquality}
                      info={I18n.t("invitations.enforceEmailEquality")}
                      readOnly={true}/>

            <DateField value={invitation.expiryDate}
                       name={I18n.t("invitations.expiryDate")}
                       showYearDropdown={true}
                       maxDate={futureDate(30)}
                       onChange={e => setInvitation({...invitation, expiryDate: e})}/>

            <SelectField value={invitation.roleValues}
                         options={invitation.roleValues}
                         name={I18n.t("invitations.roles")}
                         isMulti={true}
                         disabled={true}/>

            <DateField value={invitationRoleExpiryDate(invitation)}
                       name={I18n.t("invitations.expiryDateRole")}
                       disabled={true}/>

            <InputField value={invitation.message}
                        name={I18n.t("invitations.message")}
                        onChange={e => setInvitation({...invitation, message: e.target.value})}
                        large={true}
                        multiline={true}/>

            <section className="actions">
                <Button warningButton={true} txt={I18n.t("forms.delete")}
                        onClick={() => doDelete(true)}/>
                <Button txt={I18n.t("forms.save")} onClick={() => doUpdate()}/>
                <Button txt={I18n.t("invitations.resend")} onClick={() => doResend(true)}/>
            </section>

        </>);

    if (loading) {
        return <Spinner/>
    }
    return (
        <div className="invitation-detail-form">
            <BreadCrumb
                paths={[
                    {path: "/", value: I18n.t("breadcrumbs.home")},
                    {
                        path: `/institution-detail/${invitation.institution.id}`,
                        value: invitation.institution.displayName
                    },
                    {
                        path: `/institution-detail/${invitation.institution.id}/invitations`,
                        value: I18n.t("invitations.invitations")
                    },
                    {value: I18n.t("invitations.invitations")}
                ]}
                inForm={true}/>
            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <h2>{I18n.t("invitations.existing")}</h2>
            {invitationForm()}
        </div>
    )
};


export default InvitationDetail;
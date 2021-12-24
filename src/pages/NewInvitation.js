import React, {useEffect, useState} from "react";

import "react-datepicker/dist/react-datepicker.css";
import {allRolesByInstitution, createInvitation, institutionById} from "../api/api";
import I18n from "i18n-js";
import InputField from "../components/InputField";
import Button from "../components/Button";
import {isEmpty, stopEvent} from "../utils/forms";
import {setFlash} from "../flash/events";
import {validEmailRegExp} from "../validations/regExps";

import "./NewInvitation.scss"
import DateField from "../components/DateField";
import SelectField from "../components/SelectField";
import Spinner from "../components/Spinner";
import EmailField from "../components/EmailField";
import ErrorIndicator from "../components/ErrorIndicator";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import {useNavigate, useParams} from "react-router-dom";
import {BreadCrumb} from "../components/BreadCrumb";
import {futureDate} from "../utils/date";
import CheckBox from "../components/CheckBox";

const NewInvitation = ({user}) => {

    const intendedAuthoritysOptions = Object.values(AUTHORITIES).map(authority => ({
        value: authority.name,
        label: I18n.t(`users.authorities.${authority.name}`)
    }));

    const navigate = useNavigate();
    const cancel = () => navigate(-1);
    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [invitation, setInvitation] = useState({
        expiryDate: futureDate(14),
        intendedAuthority: AUTHORITIES.GUEST.name
    });
    const [email, setEmail] = useState("");
    const [invites, setInvites] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleExpiryDate, setRoleExpiryDate] = useState(null);
    const [roleOptions, setRoleOptions] = useState([]);
    const [institution, setInstitution] = useState([]);
    const {institutionId} = useParams();

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.INVITER, user)) {
            navigate("/404");
        } else {
            Promise.all([institutionById(institutionId), allRolesByInstitution(institutionId)]).then(res => {
                setInstitution(res[0]);
                const allRoleOptions = res[1].map(role => ({
                    value: role.id,
                    label: `${role.name} (${role.applicationName})`
                }));
                setRoleOptions(allRoleOptions);
                setLoading(false);
            });
        }
    }, [user, institutionId, navigate])


    const isValid = () => {
        return !isEmpty(invites) && !isEmpty(roles);
    };

    const setState = (attr, value) => {
        const newInvitation = {...invitation, [attr]: value};
        setInvitation(newInvitation);
    }

    const submit = () => {
        setInitial(false);
        if (isValid()) {
            setLoading(true);
            const invitationWithRoles = {
                ...invitation,
                institution: {id: institutionId},
                roles: roles.map(r => ({role: {id: r.value}}))
            }
            const invitationRequest = {
                invites: invites,
                invitation: invitationWithRoles
            }
            createInvitation(invitationRequest).then(() => {
                navigate(`/institution-detail/${institutionId}/users`);
                setFlash(I18n.t("invitations.flash.send"))
            });
        }
    };

    const removeMail = email => e => {
        stopEvent(e);
        const newInvites = invites.filter(currentMail => currentMail !== email);
        setInvites(newInvites);
    };

    const addEmail = e => {
        const email = e.target.value;
        const delimiters = [",", " ", ";", "\n", "\t"];
        let emails;
        if (!isEmpty(email) && delimiters.some(delimiter => email.indexOf(delimiter) > -1)) {
            emails = email.replace(/[;\s]/g, ",").split(",")
                .filter(part => part.trim().length > 0 && validEmailRegExp.test(part));
        } else if (!isEmpty(email) && validEmailRegExp.test(email.trim())) {
            emails = [email];
        }
        if (isEmpty(emails)) {
            setEmail("");
        } else {
            const uniqueEmails = [...new Set(invites.concat(emails))];
            setInvites(uniqueEmails);
            setEmail("");
        }
        return true;
    };

    const rolesChanged = selectedOptions => {
        if (selectedOptions === null) {
            setRoles([]);
        } else {
            const newSelectedOptions = Array.isArray(selectedOptions) ? [...selectedOptions] : [selectedOptions];
            setRoles(newSelectedOptions);
        }
    }

    const invitationForm = (disabledSubmit) => (
        <>

            <EmailField value={email}
                        onChange={e => setEmail(e.target.value)}
                        addEmail={addEmail}
                        removeMail={removeMail}
                        name={I18n.t("invitations.invitees")}
                        tooltip={I18n.t("invitations.inviteesTooltip")}
                        placeHolder={I18n.t("invitations.inviteesPlaceholder")}
                        emails={invites}
                        error={!initial && isEmpty(invites)}/>
            {(!initial && isEmpty(invites)) &&
            <ErrorIndicator msg={I18n.t("invitations.requiredEmail")}/>}

            <SelectField
                value={intendedAuthoritysOptions.find(option => option.value === invitation.intendedAuthority)}
                options={intendedAuthoritysOptions.filter(option => isAllowed(AUTHORITIES[option.value], user))}
                name={I18n.t("invitations.intendedAuthority")}
                small={true}
                clearable={false}
                toolTip={I18n.t("invitations.intendedAuthorityTooltip")}
                onChange={selectedOption => setState("intendedAuthority", selectedOption ? selectedOption.value : null)}/>

            <CheckBox name={I18n.t("invitations.enforceEmailEquality")}
                      value={invitation.enforceEmailEquality}
                      info={I18n.t("invitations.enforceEmailEquality")}
                      onChange={() => setState("enforceEmailEquality", !invitation.enforceEmailEquality)}
                      tooltip={I18n.t("invitations.enforceEmailEqualityTooltip")}/>

            <DateField value={invitation.expiryDate}
                       onChange={e => setState("expiryDate", e)}
                       allowNull={false}
                       showYearDropdown={true}
                       maxDate={futureDate(30)}
                       name={I18n.t("invitations.expiryDate")}
                       tooltip={I18n.t("invitations.expiryDateTooltip")}/>

            <SelectField value={roles}
                         options={roleOptions.filter(role => !roles.find(r => r.value === role.value))}
                         name={I18n.t("invitations.roles")}
                         toolTip={I18n.t("invitations.rolesTooltip")}
                         isMulti={true}
                         error={!initial && isEmpty(roles)}
                         searchable={true}
                         placeholder={I18n.t("invitations.rolesPlaceHolder")}
                         onChange={rolesChanged}/>
            {(!initial && isEmpty(roles)) &&
            <ErrorIndicator msg={I18n.t("invitations.requiredRole")}/>}

            <DateField value={roleExpiryDate}
                       onChange={e => setRoleExpiryDate(e)}
                       allowNull={true}
                       showYearDropdown={true}
                       name={I18n.t("invitations.expiryDateRole")}
                       tooltip={I18n.t("invitations.expiryDateRoleTooltip")}/>

            <InputField value={invitation.message}
                        onChange={e => setState("message", e.target.value)}
                        placeholder={I18n.t("invitations.messagePlaceholder")}
                        name={I18n.t("invitations.message")}
                        large={true}
                        multiline={true}/>

            <section className="actions">
                <Button cancelButton={true} txt={I18n.t("forms.cancel")} onClick={cancel}/>
                <Button disabled={disabledSubmit} txt={I18n.t("invitations.invite")} onClick={submit}/>
            </section>

        </>);

    if (loading) {
        return <Spinner/>
    }
    const disabledSubmit = (!initial && !isValid());
    return (
        <div className="invitation-form">
            <BreadCrumb
                paths={[
                    {path: "/", value: I18n.t("breadcrumbs.home")},
                    {path: `/institution-detail/${institutionId}`, value: institution.displayName},
                    {value: I18n.t("invitations.new")}
                ]}
                inForm={true}/>
            <h2>{I18n.t("invitations.new")}</h2>
            {invitationForm(disabledSubmit)}
        </div>
    )
};


export default NewInvitation;
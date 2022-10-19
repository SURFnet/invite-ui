import React, {useEffect, useState} from "react";

import "react-datepicker/dist/react-datepicker.css";
import {allGuestEmailsByInstitution, allRolesByInstitution, createInvitation, institutionById} from "../api/api";
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
import {AUTHORITIES, isAllowed, isAllowedForInviter, isInviteAllowed} from "../utils/authority";
import {useNavigate, useParams} from "react-router-dom";
import {BreadCrumb} from "../components/BreadCrumb";
import {futureDate} from "../utils/date";
import CheckBox from "../components/CheckBox";

const daysAhead = 14;

const NewInvitation = ({user}) => {

    const intendedAuthoritiesOptions = Object.values(AUTHORITIES).map(authority => ({
        value: authority.name,
        label: I18n.t(`users.authorities.${authority.name}`)
    }));

    const navigate = useNavigate();
    const {institutionId} = useParams();

    const cancel = () => navigate(`/institution-detail/${institutionId}/invitations`);

    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [invitation, setInvitation] = useState({
        expiryDate: futureDate(daysAhead),
        intendedAuthority: AUTHORITIES.GUEST.name
    });
    const [email, setEmail] = useState("");
    const [invites, setInvites] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleExpiryDate, setRoleExpiryDate] = useState(null);
    const [roleOptions, setRoleOptions] = useState([]);
    const [institution, setInstitution] = useState([]);
    const [guestEmails, setGuestEmails] = useState([]);

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.INVITER, user, institutionId)) {
            navigate("/404");
        } else {
            Promise.all([
                institutionById(institutionId),
                allRolesByInstitution(institutionId),
                allGuestEmailsByInstitution(institutionId)
            ]).then(res => {
                setInstitution(res[0]);
                let allRoleOptions = res[1].map(role => ({
                    value: role.id,
                    label: `${role.name} (${role.application.name})`,
                    defaultExpiryDays: role.defaultExpiryDays
                }));
                if (!isAllowed(AUTHORITIES.SUPER_ADMIN, user, institutionId) &&
                    !isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId)) {
                    const roleIdentifiers = user.userRoles
                        .filter(userRole => userRole.role.application.institution.id === parseInt(institutionId, 10))
                        .map(userRole => userRole.role.id);
                    allRoleOptions = allRoleOptions.filter(role => roleIdentifiers.includes(role.value));
                }
                setRoleOptions(allRoleOptions);
                setGuestEmails(res[2]);
                setLoading(false);
            });
        }
    }, [user, institutionId, navigate])


    const isValid = () => {
        return !isEmpty(invites) && (!isEmpty(roles) || !showRoles());
    };

    const setState = (attr, value) => {
        const newInvitation = {...invitation, [attr]: value};
        setInvitation(newInvitation);
    }

    const submit = () => {
        setInitial(false);
        const invitationRoles = showRoles() ? roles.map(r => ({
            role: {id: r.value},
            endDate: roleExpiryDate,
        })) : [];
        if (isValid()) {
            setLoading(true);
            const invitationWithRoles = {
                ...invitation,
                institution: {id: institutionId},
                roles: invitationRoles
            }
            const invitationRequest = {
                invites: invites,
                invitation: invitationWithRoles,
                institutionId: institutionId
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
            const allDefaultExpiryDays = newSelectedOptions
                .filter(option => option.defaultExpiryDays)
                .map(option => option.defaultExpiryDays)
                .sort();
            if (!isEmpty(allDefaultExpiryDays) && !roleExpiryDate) {
                setRoleExpiryDate(futureDate(allDefaultExpiryDays[0]));
            }
        }
    }

    const showRoles = () => invitation.intendedAuthority === AUTHORITIES.GUEST.name ||
        invitation.intendedAuthority === AUTHORITIES.INVITER.name

    const invitationForm = disabledSubmit => (
        <>

            <EmailField value={email}
                        onChange={e => setEmail(e.target.value)}
                        addEmail={addEmail}
                        removeMail={removeMail}
                        name={I18n.t("invitations.invitees")}
                        tooltip={I18n.t("invitations.inviteesTooltip")}
                        placeHolder={I18n.t("invitations.inviteesPlaceholder")}
                        emails={invites}
                        autoCompleteEmails={guestEmails}
                        error={!initial && isEmpty(invites)}/>
            {(!initial && isEmpty(invites)) &&
            <ErrorIndicator msg={I18n.t("invitations.requiredEmail")}/>}

            <CheckBox name={I18n.t("invitations.enforceEmailEquality")}
                      value={invitation.enforceEmailEquality}
                      info={I18n.t("invitations.enforceEmailEquality")}
                      onChange={() => setState("enforceEmailEquality", !invitation.enforceEmailEquality)}
                      tooltip={I18n.t("invitations.enforceEmailEqualityTooltip")}/>

            <SelectField
                value={intendedAuthoritiesOptions.find(option => option.value === invitation.intendedAuthority)}
                options={intendedAuthoritiesOptions.filter(option => isInviteAllowed(AUTHORITIES[option.value], user, institutionId) &&
                    isAllowedForInviter(AUTHORITIES[option.value], user, institutionId))}
                name={I18n.t("invitations.intendedAuthority")}
                small={true}
                clearable={false}
                toolTip={I18n.t("invitations.intendedAuthorityTooltip")}
                onChange={selectedOption => setState("intendedAuthority", selectedOption ? selectedOption.value : null)}/>

            {showRoles() && <SelectField value={roles}
                         options={roleOptions.filter(role => !roles.find(r => r.value === role.value))}
                         name={I18n.t("invitations.roles")}
                         toolTip={I18n.t("invitations.rolesTooltip")}
                         isMulti={true}
                         error={!initial && isEmpty(roles) && showRoles()}
                         searchable={true}
                         placeholder={I18n.t("invitations.rolesPlaceHolder")}
                         onChange={rolesChanged}/>}
            {(!initial && isEmpty(roles) && (invitation.intendedAuthority === AUTHORITIES.GUEST.name)) &&
            <ErrorIndicator msg={I18n.t("invitations.requiredRole")}/>}

            {showRoles() &&<DateField value={roleExpiryDate}
                       onChange={e => setRoleExpiryDate(e)}
                       allowNull={true}
                       showYearDropdown={true}
                       name={I18n.t("invitations.expiryDateRole")}
                       tooltip={I18n.t("invitations.expiryDateRoleTooltip")}/>}

            <InputField value={invitation.message}
                        onChange={e => setState("message", e.target.value)}
                        placeholder={I18n.t("invitations.messagePlaceholder")}
                        name={I18n.t("invitations.message")}
                        large={true}
                        multiline={true}/>

            <DateField value={invitation.expiryDate}
                       onChange={e => setState("expiryDate", e)}
                       allowNull={false}
                       showYearDropdown={true}
                       maxDate={futureDate(30)}
                       name={I18n.t("invitations.expiryDate")}
                       tooltip={I18n.t("invitations.expiryDateTooltip")}/>

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
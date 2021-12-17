import React, {useState} from "react";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

import {collaborationInvitations} from "../api";
import I18n from "i18n-js";
import InputField from "../components/InputField";
import Button from "../components/Button";
import {isEmpty, stopEvent} from "../utils/Utils";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {setFlash} from "../utils/Flash";
import {validEmailRegExp} from "../validations/regExps";

import "./NewInvitation.scss"
import DateField from "../components/DateField";
import SelectField from "../components/SelectField";
import UnitHeader from "../components/UnitHeader";
import Spinner from "../components/Spinner";
import EmailField from "../components/EmailField";
import ErrorIndicator from "../components/ErrorIndicator";
import {AUTHORITIES} from "../utils/authority";
import {useNavigate, useParams} from "react-router-dom";
import {futureDate} from "../utils/date";

const NewInvitation = ({institution}) => {

    const intendedRolesOptions = Object.keys(AUTHORITIES).map(authority => ({
        value: authority.name,
        label: I18n.t(`users.authorities.${authority.name}`)
    }));
    const {applicationId = null} = useParams();
    const navigate = useNavigate();
    const cancel = () => navigate(-1);

    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [expiryDate, setExpiryDate] = useState(futureDate(14));
    const [email, setEmail] = useState("");
    const [administrators, setAdministrators] = useState([]);
    const [intendedRole, setIntendedRole] = useState("");
    const [message, setMessage] = useState("");
    const [applications, setApplications] = useState([]);

    const isValid = () => {
        return (!isEmpty(administrators) && !isEmpty(intendedRole);
    };

    const doSubmit = () => {
        if (isValid()) {
            setLoading(true);
            collaborationInvitations({
                administrators: administrators.concat(fileEmails),
                message,
                membership_expiry_date: membership_expiry_date ? membership_expiry_date.getTime() / 1000 : null,
                intended_role: intended_role,
                collaboration_id: collaboration.id,
                groups: selectedGroup.map(ag => ag.value),
                expiry_date: expiry_date.getTime() / 1000
            }).then(res => {
                this.props.history.push(`/collaborations/${collaboration.id}/${isAdminView ? "admins" : "members"}`);
                setFlash(I18n.t("invitation.flash.created", {name: collaboration.name}))
            });
        } else {
            window.scrollTo(0, 0);
        }
    };

    const submit = () => {
        const {initial} = this.state;
        if (initial) {
            this.setState({initial: false}, doSubmit)
        } else {
            doSubmit();
        }
    };

    const removeMail = email => e => {
        stopEvent(e);
        const newAdministrators = administrators.filter(currentMail => currentMail !== email);
        setAdministrators(newAdministrators);
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
            this.setState({email: ""});
        } else {
            const uniqueEmails = [...new Set(administrators.concat(emails))];
            this.setState({email: ""});
            setAdministrators(uniqueEmails);
        }
        return true;
    };

    const applicationsChanged = selectedOptions => {
        if (selectedOptions === null) {
            setApplications([]);
        } else {
            const newSelectedOptions = Array.isArray(selectedOptions) ? [...selectedOptions] : [selectedOptions];
            setApplications(newSelectedOptions);
        }
    }

    const invitationForm = (disabledSubmit) =>
        <div className={"invitation-form"}>

            <EmailField value={email}
                        onChange={e => this.setState({email: e.target.value})}
                        addEmail={addEmail}
                        removeMail={removeMail}
                        name={I18n.t("invitation.invitees")}
                        emails={administrators}
                        error={!initial && isEmpty(administrators) && isEmpty(fileEmails)}/>
            {(!initial && isEmpty(administrators)) &&
            <ErrorIndicator msg={I18n.t("invitation.requiredEmail")}/>}

            <SelectField value={intendedRolesOptions.find(option => option.value === intendedRole)}
                         options={intendedRolesOptions}
                         name={I18n.t("invitation.intendedRole")}
                         small={true}
                         toolTip={I18n.t("invitation.intendedRoleTooltip")}
                         placeholder={I18n.t("collaboration.selectRole")}
                         onChange={selectedOption => setIntendedRole(selectedOption ? selectedOption.value : null)}/>

            <SelectField value={selectedGroup}
                         options={groups
                             .filter(group => !selectedGroup.find(selectedGroup => selectedGroup.value === group.value))}
                         name={I18n.t("invitation.groups")}
                         toolTip={I18n.t("invitation.groupsTooltip")}
                         isMulti={true}
                         placeholder={I18n.t("invitation.groupsPlaceHolder")}
                         onChange={applicationsChanged}/>

            <DateField value={membership_expiry_date}
                       onChange={e => this.setState({membership_expiry_date: e})}
                       allowNull={true}
                       showYearDropdown={true}
                       name={I18n.t("invitation.membershipExpiryDate")}
                       toolTip={I18n.t("invitation.membershipExpiryDateTooltip")}/>

            <InputField value={message} onChange={e => this.setState({message: e.target.value})}
                        placeholder={I18n.t("invitation.inviteesMessagePlaceholder")}
                        name={I18n.t("collaboration.message")}
                        large={true}
                        toolTip={I18n.t("invitation.inviteesTooltip")}
                        multiline={true}/>

            <DateField value={expiry_date}
                       onChange={e => this.setState({expiry_date: e})}
                       maxDate={moment().add(31, "day").toDate()}
                       name={I18n.t("invitation.expiryDate")}
                       toolTip={I18n.t("invitation.expiryDateTooltip")}/>


            {renderActions(disabledSubmit)}
        </div>;

    const renderActions = (disabledSubmit) => (
        <section className="actions">
            <Button cancelButton={true} txt={I18n.t("forms.cancel")} onClick={this.cancel}/>
            <Button disabled={disabledSubmit} txt={I18n.t("invitation.invite")} onClick={this.submit}/>
        </section>
    );

    if (loading) {
        return <Spinner>
            }
            const disabledSubmit = (!initial && !this.isValid());
            return (
            <>
                <UnitHeader obj={collaboration}
                            name={collaboration.name}/>
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={cancelDialogAction}
                                    confirm={confirmationDialogAction}
                                    leavePage={leavePage}/>
                <div className="mod-new-collaboration-invitation">
                    <h1>{I18n.t("tabs.invitation_form")}</h1>
                    <div className="new-collaboration-invitation">
                        {this.invitationForm(email, fileInputKey, fileName, fileTypeError, fileEmails, initial,
                            administrators, intended_role, message, expiry_date, disabledSubmit, groups,
                            selectedGroup, membership_expiry_date)}
                    </div>
                </div>
            </>)
            ;
            };


            export default NewInvitation;
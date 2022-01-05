import React, {useEffect, useState} from "react";
import "./RoleForm.scss";
import {useNavigate, useParams} from "react-router-dom";
import {applicationById, deleteRole, roleNameExists, saveRole} from "../api/api";
import Spinner from "../components/Spinner";
import I18n from "i18n-js";
import {setFlash} from "../flash/events";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import {isEmpty, nameUrnCompatibilityCheck} from "../utils/forms";
import ConfirmationDialog from "../components/ConfirmationDialog";
import InputField from "../components/InputField";
import ErrorIndicator from "../components/ErrorIndicator";
import Button from "../components/Button";
import {BreadCrumb} from "../components/BreadCrumb";
import SelectField from "../components/SelectField";

const RoleForm = ({user}) => {

    const authoritiesOptions = Object.values(AUTHORITIES)
        .filter(val => val.name !== AUTHORITIES.GUEST.name)
        .map(authority => ({
            value: authority.name,
            label: I18n.t(`users.authorities.${authority.name}`)
        }));

    const navigate = useNavigate();

    const cancel = () => navigate(-1);
    const {institutionId, applicationId, roleId} = useParams();

    const required = ["name"];
    const [role, setRole] = useState({});
    const [application, setApplication] = useState({});
    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [isNew, setIsNew] = useState(false);
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [alreadyExists, setAlreadyExists] = useState({});
    const [originalName, setOriginalName] = useState("");

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId)) {
            navigate("/404");
            return;
        }
        applicationById(applicationId).then(res => {
            setApplication(res);
            if (roleId === "new") {
                setIsNew(true);
                setRole({
                    name: "",
                    displayName: "",
                    authority: AUTHORITIES.INVITER.name,
                    application: {
                        id: applicationId
                    }
                });
            } else {
                const theRole = res.roles.find(r => r.id === parseInt(roleId, 10));
                theRole.application = {id: res.id}
                setRole(theRole);
                setOriginalName(theRole.name);
            }
            setLoading(false);
        });
    }, [roleId, applicationId, institutionId, user, navigate]);

    if (loading) {
        return <Spinner/>
    }

    const validateName = e =>
        roleNameExists(e.target.value, !isNew, applicationId).then(json => {
            setAlreadyExists({...alreadyExists, name: json.exists});
        });

    const isValid = () => {
        const inValid = Object.values(alreadyExists).some(val => val) ||
            required.some(attr => isEmpty(role[attr]));
        return !inValid
    };

    const doDelete = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDelete(false),
                warning: true,
                question: I18n.t("confirmationDialog.questions.delete", {
                    name: role.name,
                    object: I18n.t("roles.object").toLowerCase()
                })
            });
            setConfirmationOpen(true);
        } else {
            deleteRole(roleId).then(() => {
                navigate(-1);
                setFlash(I18n.t("forms.flash.deleted", {
                    name: role.name,
                    object: I18n.t("roles.object").toLowerCase()
                }));
            })
        }
    };

    const submit = () => {
        if (initial) {
            setInitial(false);
        }
        if (isValid()) {
            setLoading(true);
            saveRole(role).then(res => {
                navigate(`/application-detail/${institutionId}/${applicationId}`);
                setFlash(I18n.t(`forms.flash.${isNew ? "created" : "updated"}`,
                    {
                        object: I18n.t("roles.object").toLowerCase(),
                        name: role.name
                    }))
            })
        } else {
            window.scrollTo(0, 0);
        }
    }

    const setState = (attr, value) => {
        const newRole = {...role, [attr]: value};
        setRole(newRole);
    }

    const disabledSubmit = !initial && !isValid();

    return (
        <div className={"role-form"}>
            <BreadCrumb inForm={true} paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {
                    path: `/institution-detail/${institutionId}`,
                    value: application.institutionName
                },
                {
                    path: `/application-detail/${institutionId}/${application.id}`,
                    value: application.name
                },
                {
                    value: isNew ? I18n.t("forms.new", {object: I18n.t("roles.object")}) :
                        role.name
                }

            ]}/>

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <h2>
                {I18n.t(`forms.${isNew ? "new" : "editObject"}`, {
                    object: I18n.t("roles.object"),
                    name: originalName
                })}
            </h2>

            <InputField value={role.name}
                        onChange={e => {
                            setAlreadyExists({...alreadyExists, name: false})
                            nameUrnCompatibilityCheck(setState("name", e.target.value));
                        }}
                        placeholder={I18n.t("roles.namePlaceholder")}
                        onBlur={validateName}
                        toolTip={I18n.t("forms.nameTooltip", {object: I18n.t("roles.object")})}
                        error={alreadyExists.name || (!initial && isEmpty(role.name))}
                        name={I18n.t("roles.name")}/>
            {(!initial && isEmpty(role.name)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("roles.name")
            })}/>}
            {alreadyExists.name &&
            <ErrorIndicator
                msg={I18n.t("roles.alreadyExists", {value: role.name, application: application.displayName})}/>}

            <InputField value={role.displayName}
                        onChange={e => setState("displayName", e.target.value)}
                        placeholder={I18n.t("roles.displayNamePlaceholder")}
                        name={I18n.t("roles.displayName")}/>

            <SelectField
                value={authoritiesOptions.find(option => option.value === role.authority)}
                options={authoritiesOptions.filter(option => isAllowed(AUTHORITIES[option.value], user, institutionId))}
                name={I18n.t("roles.authority")}
                small={true}
                clearable={false}
                toolTip={I18n.t("roles.authorityTooltip")}
                onChange={selectedOption => setState("authority", selectedOption ? selectedOption.value : null)}/>

            <InputField value={application.name}
                        disabled={true}
                        name={I18n.t("roles.application")}/>

            <section className="actions">
                {!isNew &&
                <Button warningButton={true} txt={I18n.t("forms.delete")}
                        onClick={() => doDelete(true)}/>}
                <Button cancelButton={true} txt={I18n.t("forms.cancel")} onClick={cancel}/>
                <Button disabled={disabledSubmit} txt={I18n.t("forms.save")} onClick={submit}/>
            </section>

        </div>
    )
}
export default RoleForm
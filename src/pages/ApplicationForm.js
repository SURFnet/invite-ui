import React, {useEffect, useState} from "react";
import "./ApplicationForm.scss";
import {useNavigate, useParams} from "react-router-dom";
import {applicationById, applicationEntityIdExists, deleteApplication, saveApplication, validate} from "../api/api";
import Spinner from "../components/Spinner";
import I18n from "i18n-js";
import {setFlash} from "../flash/events";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import {isEmpty} from "../utils/forms";
import ConfirmationDialog from "../components/ConfirmationDialog";
import InputField from "../components/InputField";
import ErrorIndicator from "../components/ErrorIndicator";
import Button from "../components/Button";

const ApplicationForm = ({user}) => {

    const navigate = useNavigate();

    const cancel = () => navigate(-1);

    const required = ["displayName", "entityId"];
    const [application, setApplication] = useState({});
    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [isNew, setIsNew] = useState(false);
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [alreadyExists, setAlreadyExists] = useState({});
    const [invalid, setInvalid] = useState({});
    const [originalName, setOriginalName] = useState("");
    const {institutionId, applicationId} = useParams();

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user)) {
            navigate("/404");
            return;
        }
        if (applicationId === "new") {
            setIsNew(true);
            setApplication({
                displayName: "",
                entityId: "",
                landingPage: "",
                provisioningHookUrl: "",
                provisioningHookUsername: "",
                provisioningHookPassword: "",
                provisioningHookEmail: "",
                institution: {
                    id: institutionId
                }

            });
            setLoading(false);
        } else {
            applicationById(applicationId).then(res => {
                setApplication(res);
                setLoading(false);
                setOriginalName(res.displayName);
            });
        }
    }, [applicationId, institutionId, user, navigate]);

    const validateEntityId = e =>
        applicationEntityIdExists(e.target.value, !isNew).then(json => {
            setAlreadyExists({...alreadyExists, entityId: json.exists});
        });

    const validateProvisioningHookUrl = e =>
        validate("url", e.target.value).then(json => {
            setInvalid({...setInvalid, provisioningHookUrl: !json.valid});
        });

    const validateLandingPage = e =>
        validate("url", e.target.value).then(json => {
            setInvalid({...setInvalid, landingPage: !json.valid});
        });

    const validateProvisioningHookEmail = e =>
        validate("email", e.target.value).then(json => {
            setInvalid({...setInvalid, provisioningHookEmail: !json.valid});
        });

    const isValid = () => {
        const inValid = Object.values(invalid).some(val => val) || Object.values(alreadyExists).some(val => val) ||
            required.some(attr => isEmpty(application[attr])) ||
            (!isEmpty(application.provisioningHookUrl) && !isEmpty(application.provisioningHookEmail));
        return !inValid
    };

    const doDelete = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDelete(false),
                warning: true,
                question: I18n.t("confirmationDialog.questions.delete", {
                    name: application.displayName,
                    object: I18n.t("applications.object").toLowerCase()
                })
            });
            setConfirmationOpen(true);
        } else {
            deleteApplication(application).then(() => {
                navigate("/home");
                setFlash(I18n.t("forms.flash.deleted", {
                    name: application.displayName,
                    object: I18n.t("applications.object").toLowerCase()
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
            saveApplication(application).then(res => {
                navigate(`/application-detail/${res.id}`);
                setFlash(I18n.t("forms.flash.created",
                    {
                        object: I18n.t("applications.object").toLowerCase(),
                        name: application.displayName
                    }))
            })
        } else {
            window.scrollTo(0, 0);
        }
    }

    const setState = (attr, value) => {
        const newApplication = {...application, [attr]: value};
        setApplication(newApplication);
    }

    if (loading) {
        return <Spinner/>
    }
    const disabledSubmit = !initial && !isValid();

    return (
        <div className={"application-form"}>

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <h2 className="section-separator">{I18n.t(`applications.${isNew ? "newTitle" : "editTitle"}`, {name: originalName})}</h2>

            <InputField value={application.displayName}
                        onChange={e => setState("displayName", e.target.value)}
                        placeholder={I18n.t("applications.namePlaceholder")}
                        error={!initial && isEmpty(application.displayName)}
                        name={I18n.t("applications.displayName")}/>
            {(!initial && isEmpty(application.displayName)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("applications.displayName")
            })}/>}

            <InputField value={application.entityId}
                        onChange={e => {
                            setState("entityId", e.target.value);
                            setAlreadyExists({...alreadyExists, entityId: false});
                        }}
                        placeholder={I18n.t("applications.entityIdPlaceholder")}
                        onBlur={validateEntityId}
                        error={alreadyExists.entityId || (!initial && isEmpty(application.entityId))}
                        name={I18n.t("applications.entityId")}/>
            {(!initial && isEmpty(application.entityId)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("applications.entityId")
            })}/>}

            {alreadyExists.entityId &&
            <ErrorIndicator msg={I18n.t("forms.alreadyExists", {
                object: I18n.t("applications.object").toLowerCase(),
                attribute: I18n.t("applications.entityId").toLowerCase(),
                value: application.entityId
            })}/>}

            <InputField value={application.landingPage}
                        onChange={e => {
                            setState("landingPage", e.target.value);
                            setInvalid({...setInvalid, landingPage: false});
                        }}
                        placeholder={I18n.t("applications.landingPagePlaceholder")}
                        onBlur={validateLandingPage}
                        error={invalid.landingPage}
                        name={I18n.t("applications.landingPage")}/>
            {invalid.landingPage &&
            <ErrorIndicator msg={I18n.t("forms.invalid", {
                attribute: I18n.t("applications.landingPage").toLowerCase(),
                value: application.landingPage
            })}/>}

            <InputField value={application.provisioningHookUrl}
                        onChange={e => {
                            setState("provisioningHookUrl", e.target.value);
                            setInvalid({...setInvalid, provisioningHookUrl: false});
                        }}
                        placeholder={I18n.t("applications.provisioningHookUrlPlaceholder")}
                        onBlur={validateProvisioningHookUrl}
                        error={invalid.provisioningHookUrl}
                        name={I18n.t("applications.provisioningHookUrl")}/>
            {invalid.provisioningHookUrl &&
            <ErrorIndicator msg={I18n.t("forms.invalid", {
                attribute: I18n.t("applications.provisioningHookUrl").toLowerCase(),
                value: application.provisioningHookUrl
            })}/>}

            <InputField value={application.provisioningHookUsername}
                        onChange={e => {
                            setState("provisioningHookUsername", e.target.value);
                        }}
                        placeholder={I18n.t("applications.provisioningHookUsernamePlaceholder")}
                        name={I18n.t("applications.provisioningHookUsername")}/>

            <InputField value={application.provisioningHookPassword}
                        onChange={e => {
                            setState("provisioningHookPassword", e.target.value);
                        }}
                        placeholder={I18n.t("applications.provisioningHookPasswordPlaceholder")}
                        name={I18n.t("applications.provisioningHookPassword")}/>

            <InputField value={application.provisioningHookEmail}
                        onChange={e => {
                            setState("provisioningHookEmail", e.target.value);
                            setInvalid({...setInvalid, provisioningHookEmail: false});
                        }}
                        placeholder={I18n.t("applications.provisioningHookEmailPlaceholder")}
                        onBlur={validateProvisioningHookEmail}
                        error={invalid.provisioningHookEmail}
                        name={I18n.t("applications.provisioningHookEmail")}/>
            {invalid.provisioningHookEmail &&
            <ErrorIndicator msg={I18n.t("forms.invalid", {
                attribute: I18n.t("applications.provisioningHookEmail").toLowerCase(),
                value: application.provisioningHookEmail
            })}/>}
            {(!isEmpty(application.provisioningHookEmail) && !isEmpty(application.provisioningHookUrl)) &&
            <ErrorIndicator msg={I18n.t("applications.conflictProvisioning")}/>}

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
export default ApplicationForm
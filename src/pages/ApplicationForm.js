import React, {useEffect, useState} from "react";
import "./ApplicationForm.scss";
import {useNavigate, useParams} from "react-router-dom";
import {
    applicationById,
    applicationEntityIdExists,
    deleteApplication,
    institutionById,
    saveApplication,
    validate
} from "../api/api";
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

const ApplicationForm = ({user}) => {

    const navigate = useNavigate();

    const {institutionId, applicationId} = useParams();

    const cancel = () => navigate(applicationId === "new" ? `/institution-detail/${institutionId}` :
        `/application-detail/${institutionId}/${applicationId}`);

    const required = ["name", "entityId", "landingPage"];
    const [application, setApplication] = useState({});
    const [institution, setInstitution] = useState({});
    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [isNew, setIsNew] = useState(false);
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [alreadyExists, setAlreadyExists] = useState({});
    const [invalid, setInvalid] = useState({});
    const [originalName, setOriginalName] = useState("");

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId)) {
            navigate("/404");
            return;
        }
        if (applicationId === "new") {
            institutionById(institutionId).then(res => {
                setIsNew(true);
                setInstitution(res);
                setApplication({
                    name: "",
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
            })
        } else {
            applicationById(applicationId).then(res => {
                res.institution = {
                    id: institutionId
                }
                setApplication(res);
                setLoading(false);
                setOriginalName(res.name);
            });
        }
    }, [applicationId, institutionId, user, navigate]);

    const validateEntityId = e =>
        applicationEntityIdExists(e.target.value, !isNew, institutionId).then(json => {
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
                    name: application.name,
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
                navigate(`/application-detail/${institutionId}/${res.id}`);
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
            <BreadCrumb inForm={true} paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {
                    path: `/institution-detail/${institutionId}`,
                    value: isNew ? institution.displayName : application.institutionName
                },
                {
                    value: isNew ? I18n.t("forms.new", {object: I18n.t("applications.object")}) :
                        application.name
                }
            ]}/>

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <h2>
                {I18n.t(`forms.${isNew ? "new" : "editObject"}`, {
                    object: I18n.t("applications.object"),
                    name: originalName
                })}
            </h2>

            <InputField value={application.name}
                        onChange={e => {
                            setAlreadyExists({...alreadyExists, name: false});
                            setState("name", nameUrnCompatibilityCheck(e.target.value))
                        }}
                        placeholder={I18n.t("applications.namePlaceholder")}
                        error={!initial && isEmpty(application.name)}
                        toolTip={I18n.t("forms.nameTooltip", {object: I18n.t("applications.object")})}
                        name={I18n.t("applications.name")}/>
            {(!initial && isEmpty(application.name)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("applications.name")
            })}/>}

            <InputField value={application.displayName}
                        onChange={e => setState("displayName", e.target.value)}
                        placeholder={I18n.t("applications.displayNamePlaceholder")}
                        name={I18n.t("applications.displayName")}/>

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
                        error={invalid.landingPage || (!initial && isEmpty(application.landingPage))}
                        name={I18n.t("applications.landingPage")}/>
            {invalid.landingPage &&
            <ErrorIndicator msg={I18n.t("forms.invalid", {
                attribute: I18n.t("applications.landingPage").toLowerCase(),
                value: application.landingPage
            })}/>}
            {(!initial && isEmpty(application.landingPage)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("applications.landingPage")
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
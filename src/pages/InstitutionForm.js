import React, {useEffect, useState} from "react";
import "./InstitutionForm.scss";
import {useNavigate, useParams} from "react-router-dom";
import {
    deleteInstitution,
    institutionById,
    institutionEntityIdExists,
    institutionSchacHomeExists,
    saveInstitution,
    validate,
    institutionUserCount
} from "../api/api";
import Spinner from "../components/Spinner";
import I18n from "i18n-js";
import {setFlash} from "../flash/events";
import {AUTHORITIES, isAllowed, isSuperAdmin} from "../utils/authority";
import {isEmpty, nameUrnCompatibilityCheck} from "../utils/forms";
import ConfirmationDialog from "../components/ConfirmationDialog";
import InputField from "../components/InputField";
import ErrorIndicator from "../components/ErrorIndicator";
import Button from "../components/Button";
import {BreadCrumb} from "../components/BreadCrumb";

const InstitutionForm = ({user}) => {

    const navigate = useNavigate();
    const {institutionId} = useParams();

    const cancel = () => navigate(institutionId === "new" ? `/home` :
        `/institution-detail/${institutionId}`);

    const required = ["displayName", "entityId", "homeInstitution"];
    const [institution, setInstitution] = useState({});
    const [userCount, setUserCount] = useState({});
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
        if (institutionId === "new") {
            setIsNew(true);
            setInstitution({
                entityId: "",
                homeInstitution: "",
                displayName: "",
                aupUrl: "",
                aupVersion: 1
            });
            setLoading(false);
        } else {
            Promise.all([institutionById(institutionId), institutionUserCount(institutionId)]).then(res => {
                setInstitution(res[0]);
                setUserCount(res[1]);
                setLoading(false);
                setOriginalName(res[0].displayName);
            });
        }
    }, [institutionId, user, navigate]);

    const validateEntityId = e =>
        institutionEntityIdExists(e.target.value, !isNew).then(json => {
            setAlreadyExists({...alreadyExists, entityId: json.exists});
        });

    const validateSchacHome = e =>
        institutionSchacHomeExists(e.target.value, !isNew).then(json => {
            setAlreadyExists({...alreadyExists, homeInstitution: json.exists});
        });

    const validateAupUrl = e =>
        validate("url", e.target.value).then(json => {
            setInvalid({...setInvalid, aupUrl: !json.valid});
        });

    const isValid = () => {
        const inValid = Object.values(invalid).some(val => val) || Object.values(alreadyExists).some(val => val) ||
            required.some(attr => isEmpty(institution[attr]));
        return !inValid
    };

    const doDelete = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDelete(false),
                warning: true,
                question: I18n.t("confirmationDialog.questions.delete", {
                    name: institution.displayName,
                    object: I18n.t("institutions.object").toLowerCase()
                })
            });
            setConfirmationOpen(true);
        } else {
            deleteInstitution(institution).then(() => {
                navigate("/home");
                setFlash(I18n.t("forms.flash.deleted", {
                    name: institution.displayName,
                    object: I18n.t("institutions.object").toLowerCase()
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
            saveInstitution(institution).then(res => {
                navigate(`/institution-detail/${res.id}`);
                setFlash(I18n.t(`forms.flash.${isNew ? "created" : "updated"}`,
                    {
                        object: I18n.t("institutions.object").toLowerCase(),
                        name: institution.displayName
                    }))
            })
        } else {
            window.scrollTo(0, 0);
        }
    }

    const setState = (attr, value) => {
        const newInstitution = {...institution, [attr]: value};
        setInstitution(newInstitution);
    }

    if (loading) {
        return <Spinner/>
    }
    const disabledSubmit = !initial && !isValid();

    return (
        <div className={"institution-form"}>
            <BreadCrumb inForm={true} paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {
                    value: isNew ? I18n.t("forms.new", {object: I18n.t("institutions.object")}) :
                        institution.displayName
                }
            ]}/>

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}
            <h2>
                {I18n.t(`forms.${isNew ? "new" : "editObject"}`, {
                    object: I18n.t("institutions.object"),
                    name: originalName
                })}
            </h2>
            <InputField value={institution.displayName}
                        onChange={e => setState("displayName", e.target.value)}
                        placeholder={I18n.t("institutions.namePlaceholder")}
                        error={!initial && isEmpty(institution.displayName)}
                        name={I18n.t("institutions.name")}/>
            {(!initial && isEmpty(institution.displayName)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("institutions.displayName")
            })}/>}

            <InputField value={institution.entityId}
                        onChange={e => {
                            setState("entityId", e.target.value);
                            setAlreadyExists({...alreadyExists, entityId: false});
                        }}
                        disabled={!isSuperAdmin(user)}
                        placeholder={I18n.t("institutions.entityIdPlaceholder")}
                        onBlur={validateEntityId}
                        error={alreadyExists.entityId || (!initial && isEmpty(institution.entityId))}
                        name={I18n.t("institutions.entityId")}/>
            {(!initial && isEmpty(institution.entityId)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("institutions.entityId")
            })}/>}

            {alreadyExists.entityId &&
            <ErrorIndicator msg={I18n.t("forms.alreadyExists", {
                object: I18n.t("institutions.object").toLowerCase(),
                attribute: I18n.t("institutions.entityId").toLowerCase(),
                value: institution.entityId
            })}/>}

            <InputField value={institution.homeInstitution}
                        onChange={e => {
                            setState("homeInstitution", nameUrnCompatibilityCheck(e.target.value));
                            setAlreadyExists({...alreadyExists, homeInstitution: false});
                        }}
                        disabled={!isSuperAdmin(user)}
                        placeholder={I18n.t("institutions.homeInstitutionPlaceholder")}
                        onBlur={validateSchacHome}
                        toolTip={I18n.t("forms.nameTooltip", {object: I18n.t("institutions.object")})}
                        error={alreadyExists.homeInstitution || (!initial && isEmpty(institution.homeInstitution))}
                        name={I18n.t("institutions.homeInstitution")}/>
            {(!initial && isEmpty(institution.homeInstitution)) &&
            <ErrorIndicator msg={I18n.t("forms.required", {
                attribute: I18n.t("institutions.homeInstitution")
            })}/>}

            {alreadyExists.homeInstitution &&
            <ErrorIndicator msg={I18n.t("forms.alreadyExists", {
                object: I18n.t("institutions.object").toLowerCase(),
                attribute: I18n.t("institutions.homeInstitution").toLowerCase(),
                value: institution.homeInstitution
            })}/>}

            <InputField value={institution.aupUrl}
                        onChange={e => {
                            setState("aupUrl", e.target.value);
                            setInvalid({...setInvalid, aupUrl: false});
                        }}
                        placeholder={I18n.t("institutions.aupUrlPlaceholder")}
                        onBlur={validateAupUrl}
                        error={invalid.aupUrl}
                        name={I18n.t("institutions.aupUrl")}/>
            {invalid.aupUrl &&
            <ErrorIndicator msg={I18n.t("forms.invalid", {
                attribute: I18n.t("institutions.aupUrl").toLowerCase(),
                value: institution.aupUrl
            })}/>}

            <section className="actions">
                {!isNew &&
                <Button warningButton={true}
                        disabled={userCount > 0}
                        txt={I18n.t("forms.delete")}
                        onClick={() => doDelete(true)}/>}
                <Button cancelButton={true} txt={I18n.t("forms.cancel")} onClick={cancel}/>
                <Button disabled={disabledSubmit} txt={I18n.t("forms.save")} onClick={submit}/>
            </section>

        </div>
    )
}
export default InstitutionForm
import React, {useEffect, useState} from "react";
import "./Spinner.scss"
import {useNavigate, useParams} from "react-router-dom";
import {
    deleteInstitution,
    institutionById,
    institutionEntityIdExists,
    institutionSchacHomeExists,
    saveInstitution
} from "../api/api";
import Spinner from "./Spinner";
import I18n from "i18n-js";
import {setFlash} from "../flash/events";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import {isEmpty} from "../utils/forms";
import ConfirmationDialog from "./ConfirmationDialog";
import InputField from "./InputField";
import ErrorIndicator from "./ErrorIndicator";

const InstitutionForm = ({user}) => {

    const required = ["displayName", "entityId", "homeInstitution"]
    const navigate = useNavigate();
    const [institution, setInstitution] = useState({});
    const [loading, setLoading] = useState(true);
    const [initial, setInitial] = useState(true);
    const [confirmation, setConfirmation] = useState({
        open: false,
        question: I18n.t("institutions.confirmation"),
        warning: false,
        action: doDelete(true),
        cancel: setConfirmation({...confirmation, open: false})
    });
    const [alreadyExists, setAlreadyExists] = useState({});
    let originalName;
    const {institutionId} = useParams();
    let isNew = false;

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.SUPER_ADMIN, user)) {
            navigate("/404");
            return;
        }
        if (institutionId === "new") {
            isNew = true;
            setInstitution({
                "entityId": "",
                "homeInstitution": "",
                "displayName": "",
                "aupUrl": "",
                "aupVersion": "1"
            });
            setLoading(false);
        } else {
            institutionById(institutionId).then(res => {
                setInstitution(res);
                setLoading(false);
                originalName = res.displayName;
            });
        }
    }, [user]);

    const validateEntityId = e =>
        institutionEntityIdExists(e.target.value, !isNew).then(json => {
            setAlreadyExists({...alreadyExists, entityId: json.exists});
        });

    const validateSchacHome = e =>
        institutionSchacHomeExists(e.target.value, !isNew).then(json => {
            setAlreadyExists({...alreadyExists, homeInstitution: json.exists});
        });

    const cancel = () => navigate("/institutions");

    const doDelete = showConfirmation => () => {
        if (showConfirmation) {
            setConfirmation({...confirmation, open: true});
        } else {
            deleteInstitution(institution).then(r => {
                navigate("/institutions");
                setFlash(I18n.t("institutions.flash.deleted"));
            })
        }
    };

    const isValid = () => {
        const inValid = Object.values(alreadyExists).some(val => val) || required.some(attr => isEmpty(institution[attr]));
        return !inValid
    };

    const submit = () => {
        if (initial) {
            setInitial(false);
        }
        if (isValid()) {
            setLoading(true);
            saveInstitution(institution).then(() => {
                navigate("/institutions")
                setFlash(I18n.t("institutions.flash.created", {name: institution.displayName}))
            });
        } else {
            window.scrollTo(0, 0);
        }
    };

    const setState = (attr, value) => setInstitution({...institution, attr: value});

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className={"institution-form"}>
            <ConfirmationDialog isOpen={confirmation.open}
                                cancel={confirmation.cancel}
                                confirm={confirmation.action}
                                isWarning={confirmation.warning}
                                question={confirmation.question}/>

            <h1 className="section-separator">{I18n.t(`institutions.${isNew ? "newTitle" : "editTitle"}`, {name:originalName})}</h1>

            <InputField value={institution.displayName}
                        onChange={e => setState("displayName", e.target.value)}
                        placeholder={I18n.t("institutions.namePlaceHolder")}
                        error={!initial && isEmpty(institution.displayName)}
                        name={I18n.t("institutions.displayName")}/>
            {(!initial && isEmpty(institution.displayName)) && <ErrorIndicator msg={I18n.t("organisation.required", {
                attribute: I18n.t("institutions.displayName").toLowerCase()
            })}/>}

        </div>
    )
}
export default InstitutionForm
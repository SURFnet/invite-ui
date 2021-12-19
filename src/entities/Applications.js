import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {applicationsByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import "./Applications.scss";

const Applications = ({user, institution}) => {

    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        applicationsByInstitution(institution.id).then(res => {
            setApplications(res);
            setLoading(false);
        })
    }, [institution]);

    const openApplication = application => e => {
        stopEvent(e);
        navigate(`/application-detail/${institution.id}/${application.id}`);
    };

    if (loading) {
        return <Spinner/>
    }
    const columns = [
        {
            key: "displayName",
            header: I18n.t("applications.displayName"),
            mapper: application => application.displayName,
        },
        {
            key: "entityId",
            header: I18n.t("applications.entityId"),
            mapper: application => application.entityId,
        },
        {
            key: "landingPage",
            header: I18n.t("applications.landingPage"),
            mapper: application => application.landingPage,
        },
        {
            key: "provisioning",
            header: I18n.t("applications.provisioning"),
            mapper: application => application.provisioningHookUrl || application.provisioningHookEmail || I18n.t("applications.noProvisioning"),
        },

    ]
    return (
        <div className="mod-applications">
            <Entities entities={applications}
                      modelName="applications"
                      searchAttributes={["displayName", "entityId"]}
                      defaultSort="displayName"
                      columns={columns}
                      hideTitle={true}
                      rowLinkMapper={() => openApplication}
                      showNew={isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user)}
                      newEntityPath={`/application/${institution.id}/new`}
                      loading={loading}/>
        </div>
    )

}
export default Applications;
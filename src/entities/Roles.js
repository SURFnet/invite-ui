import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allRolesByApplication, allRolesByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./Roles.scss";

const Roles = ({institutionId, applicationId = null}) => {

    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const promise = applicationId ? allRolesByApplication(applicationId) : allRolesByInstitution(institutionId);
        promise.then(res => {
            setRoles(res);
            setLoading(false);
        })
    }, [applicationId, institutionId]);

    const openRole = role => e => {
        stopEvent(e);
        navigate(`/role-detail/${role.id}`);
    };

    if (loading) {
        return <Spinner/>
    }
    const columns = [
        {
            key: "name",
            header: I18n.t("roles.name"),
            mapper: role => role.name,
        },
        {
            key: "name",
            header: I18n.t("roles.applicationName"),
            mapper: role => role.applicationName,
        },
        {
            key: "auditable_createdAt",
            header: I18n.t("forms.createdAt"),
            mapper: role => role.auditable.createdAt,
        },
    ]
    return (
        <div className="roles">
            <Entities entities={roles}
                      modelName="roles"
                      searchAttributes={["name"]}
                      defaultSort="name"
                      columns={columns}
                      hideTitle={true}
                      rowLinkMapper={() => openRole}
                      showNew={true}
                      newEntityPath={"/role/new"}
                      loading={loading}/>
        </div>
    )

}
export default Roles;
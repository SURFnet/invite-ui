import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allRolesByApplication} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./Roles.scss";
import {formatDate} from "../utils/date";

const Roles = ({institutionId, application = null}) => {

    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const promise = allRolesByApplication(application.id);
        promise.then(res => {
            setRoles(res);
            setLoading(false);
        })
    }, [application, institutionId]);

    const openRole = role => e => {
        stopEvent(e);
        navigate(`/role/${institutionId}/${application.id}/${role.id}`);
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
            key: "displayName",
            header: I18n.t("roles.displayName"),
            mapper: role => role.displayName,
        },
        // {
        //     key: "authority",
        //     header: I18n.t("roles.authority"),
        //     mapper: role => I18n.t(`users.authorities.${role.authority}`),
        // },
        {
            key: "application__name",
            header: I18n.t("roles.applicationName"),
            mapper: role => role.application.name,
        },
        {
            key: "auditable_createdAt",
            header: I18n.t("forms.createdAt"),
            mapper: role => formatDate(role.auditable.createdAt),
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
                      newEntityPath={`/role/${institutionId}/${application.id}/new`}
                      loading={loading}/>
        </div>
    )

}
export default Roles;
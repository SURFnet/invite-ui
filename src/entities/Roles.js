import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import { allRolesByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import {AUTHORITIES} from "../utils/authority";
import "./Roles.scss";

const Roles = ({institutionId}) => {

    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        allRolesByInstitution().then(res => {
            setRoles(res);
            setLoading(false);
        })
    }, []);

    const openRole = role => e => {
        stopEvent(e);
        navigate(`/role-detail/${role.id}`);
    };

    if (loading) {
        return <Spinner/>
    }
    const columns = [
        {
            key: "displayName",
            header: I18n.t("roles.displayName"),
            mapper: role => role.displayName,
        },
        {
            key: "entityId",
            header: I18n.t("roles.entityId"),
            mapper: role => role.entityId,
        },
        {
            key: "homeRole",
            header: I18n.t("roles.homeRole"),
            mapper: role => role.homeRole,
        },
        {
            key: "aupUrl",
            header: I18n.t("roles.aupUrl"),
            ignoreRowClick: true,
            mapper: role => <a href={role.aupUrl} target="_blank" rel="noreferrer">{role.aupUrl}</a> ,
        },

    ]
    return (
        <div className="roles">
            <Entities entities={roles}
                      modelName="roles"
                      searchAttributes={["displayName", "homeRole", "entityId"]}
                      defaultSort="displayName"
                      columns={columns}
                      hideTitle={true}
                      rowLinkMapper={() => openRole}
                      showNew={user.authority === AUTHORITIES.SUPER_ADMIN.name}
                      newEntityPath={"/role/new"}
                      loading={loading}/>
        </div>
    )

}
export default Roles;
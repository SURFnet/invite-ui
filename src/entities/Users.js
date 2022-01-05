import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allUsersByApplication, allUsersByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./Users.scss";
import {AUTHORITIES, isAllowed} from "../utils/authority";

const Users = ({user, institutionId, application = null}) => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const promise = application ? allUsersByApplication(application.id) : allUsersByInstitution(institutionId);
        promise.then(res => {
            setUsers(res);
            setLoading(false);
        })
    }, [institutionId, application]);

    const openUser = entity => e => {
        stopEvent(e);
        navigate(`/user-detail/${entity.id}/${institutionId}`);
    };

    if (loading) {
        return <Spinner/>
    }

    const getRoles = entity => {
        return <ul>
            {entity.roles.map((role, i) => <li key={i}>{`${role.role.name} (${role.role.applicationName})`}</li>)}
        </ul>
    }

    const rowLinkMapper = entity => {
        const allowed = isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, institutionId) && isAllowed(AUTHORITIES[entity.authority], user, institutionId);
        return allowed ? e => openUser(e) : null;
    }

    const columns = [
        {
            key: "name",
            sortable: false,
            header: I18n.t("users.name"),
            mapper: entity => entity.name
        },
        {
            key: "email",
            header: I18n.t("users.email"),
            mapper: entity => entity.email,
        },
        {
            key: "authority",
            header: I18n.t("users.authority"),
            mapper: entity => {
                const membership = entity.institutionMemberships.find(membership => membership.institution.id === institutionId);
                return I18n.t(`users.authorities.${membership.authority}`);
            },
        },
        {
            key: "roles",
            sortable: false,
            header: I18n.t("users.roles"),
            mapper: entity => getRoles(entity),
        },
    ]

    return (
        <div className="users">
            <Entities entities={users}
                      modelName="users"
                      searchAttributes={["name", "email"]}
                      defaultSort="email"
                      columns={columns}
                      hideTitle={true}
                      rowLinkMapper={rowLinkMapper}
                      showNew={false}
                      loading={loading}/>
        </div>
    )

}
export default Users;
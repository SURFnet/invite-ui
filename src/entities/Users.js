import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allUsersByApplication, allUsersByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./Users.scss";
import {AUTHORITIES, isAllowed, isAllowedForInviter} from "../utils/authority";

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

    const isAllowedForUser = entity => {
        const authorities = entity.institutionMemberships.map(institutionMembership => institutionMembership.authority);
        return isAllowed(AUTHORITIES.INVITER, user, institutionId) &&
            authorities.every(authority => isAllowedForInviter(AUTHORITIES[authority], user, institutionId));
    }

    const rowLinkMapper = entity => {
        const allowedFor = isAllowedForUser(entity);
        return allowedFor ? e => openUser(e) : null;
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
                const institutionIdentifier = parseInt(institutionId, 10);
                const membership = entity.institutionMemberships.find(membership => membership.institution.id === institutionIdentifier);
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
                      isAllowedForUser={isAllowedForUser}
                      showNew={true}
                      newEntityPath={`/new-invitation/${institutionId}`}
                      loading={loading}/>
        </div>
    )

}
export default Users;
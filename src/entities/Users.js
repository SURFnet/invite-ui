import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allUsersByApplication, allUsersByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./Users.scss";
import {viewOtherUserAllowed} from "../utils/authority";
import {formatDateShort} from "../utils/date";

const Users = ({user, institutionId, application = null}) => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const promise = application ? allUsersByApplication(application.id) : allUsersByInstitution(institutionId);
        promise.then(res => {
            const institutionIdentifier = parseInt(institutionId, 10);
            res.forEach(u => {
                const membership = u.institutionMemberships.find(membership => membership.institution.id === institutionIdentifier);
                u.authority = I18n.t(`users.authorities.${membership.authority}`);
            })
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
        return <ul className={meClassName(entity)}>
            {entity.roles.map((role, i) =>
                <li key={i}>
                    {`${role.role.name} (${role.role.applicationName}) ${role.endDate ? I18n.t("users.expires", {date: formatDateShort(role.endDate)}) : ""}`}
                </li>)}
        </ul>
    }

    const isAllowedForUser = entity => viewOtherUserAllowed(user, entity);

    const rowLinkMapper = entity => {
        const allowedFor = isAllowedForUser(entity);
        return allowedFor ? e => openUser(e) : null;
    }

    const meClassName = entity => entity.id === user.id ? "me" : null;

    const columns = [
        {
            key: "name",
            nonSortable: true,
            header: I18n.t("users.name"),
            mapper: entity => <span className={meClassName(entity)}>{entity.name}</span>
        },
        {
            key: "email",
            header: I18n.t("users.email"),
            mapper: entity => <span className={meClassName(entity)}>{entity.email}</span>
        },
        {
            key: "authority",
            header: I18n.t("users.authority"),
            mapper: entity => <span className={meClassName(entity)}>{entity.authority}</span>
        },
        {
            key: "roles",
            nonSortable: true,
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
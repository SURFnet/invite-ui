import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {
    allInvitationsByApplication,
    allInvitationsByInstitution,
    allUsersByApplication,
    allUsersByInstitution
} from "../api/api";
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
        const promises = application ? [allUsersByApplication(application.id), allInvitationsByApplication(application.id)] :
            [allUsersByInstitution(institutionId), allInvitationsByInstitution(institutionId)];
        Promise.all(promises).then(res => {
            const allUsers = res[0];
            const allInvitations = res[1];
            allInvitations.forEach(invitation => {
                invitation.isInvitation = true;
            });
            setUsers(allUsers.concat(allInvitations));
            setLoading(false);
        })
    }, [institutionId, application]);

    const openUser = entity => e => {
        stopEvent(e);
        if (entity.isInvitation) {
            navigate(`/invitation-detail/${entity.id}`);
        } else {
            navigate(`/user-detail/${entity.id}`);
        }

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
        const allowed = entity.isInvitation ? (isAllowed(AUTHORITIES.INVITER, user) && isAllowed(AUTHORITIES[entity.intendedAuthority], user)) :
            (isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user) && isAllowed(AUTHORITIES[entity.authority], user));
        return allowed ? e => openUser(e) : null;
    }

    const columns = [
        {
            key: "name",
            sortable: false,
            header: I18n.t("users.name"),
            mapper: entity => entity.isInvitation ? "-" : `${entity.givenName} ${entity.familyName}`,
        },
        {
            key: "email",
            header: I18n.t("users.email"),
            mapper: entity => entity.email,
        },
        {
            key: "authority",
            header: I18n.t("users.authority"),
            mapper: entity => I18n.t(`users.authorities.${entity.isInvitation ? entity.intendedAuthority : entity.authority}`),
        },
        {
            key: "status",
            header: I18n.t("users.status"),
            mapper: entity => entity.isInvitation ?
                <span className={"open-invitation"}>{I18n.t(`users.statuses.open`)}</span> : "",
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
                      searchAttributes={["givenName", "email", "familyName"]}
                      defaultSort="email"
                      columns={columns}
                      hideTitle={true}
                      rowLinkMapper={rowLinkMapper}
                      showNew={true}
                      newEntityPath={`/new-invitation/${institutionId}`}
                      loading={loading}/>
        </div>
    )

}
export default Users;
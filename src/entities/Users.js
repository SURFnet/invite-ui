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

const Users = ({institution, application = null}) => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const promises = application ? [allUsersByApplication(application.id), allInvitationsByApplication(application.id)] :
            [allUsersByInstitution(institution.id), allInvitationsByInstitution(institution.id)];
        Promise.all(promises).then(res => {
            const allUsers = res[0];
            const allInvitations = res[1];
            allInvitations.forEach(invitation => {
                invitation.isInvitation = true;
            });
            setUsers(allUsers.concat(allInvitations));
            setLoading(false);
        })
    }, [institution, application]);

    const openUser = user => e => {
        stopEvent(e);
        navigate(`/user-detail/${user.id}`);
    };

    if (loading) {
        return <Spinner/>
    }

    const getRoles = user => {
        return <ul>
            {user.roles.map((role, i) => <li key={i}>{`${role.role.name} (${role.role.applicationName})`}</li>)}
        </ul>
    }

    const columns = [
        {
            key: "name",
            sortable: false,
            header: I18n.t("users.name"),
            mapper: user => user.isInvitation ? "-" : `${user.givenName} ${user.familyName}`,
        },
        {
            key: "email",
            header: I18n.t("users.email"),
            mapper: user => user.email,
        },
        {
            key: "authority",
            header: I18n.t("users.authority"),
            mapper: user => I18n.t(`users.authorities.${user.isInvitation ? user.intendedRole : user.authority}`),
        },
        {
            key: "status",
            header: I18n.t("users.status"),
            mapper: user => user.isInvitation ? I18n.t(`users.statuses.open`) : "",
        },
        {
            key: "roles",
            sortable: false,
            header: I18n.t("users.roles"),
            mapper: user => user.isInvitation ? "" : getRoles(user),
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
                      rowLinkMapper={() => openUser}
                      showNew={true}
                      newEntityPath={"/user/new"}
                      loading={loading}/>
        </div>
    )

}
export default Users;
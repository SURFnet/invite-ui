import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allInvitationsByApplication, allInvitationsByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./Users.scss";
import {AUTHORITIES, isAllowed} from "../utils/authority";

const Invitations = ({user, institutionId, application = null}) => {

    const [loading, setLoading] = useState(true);
    const [invitations, setInvitations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const promise = application ? allInvitationsByApplication(application.id) : allInvitationsByInstitution(institutionId);
        promise.then(res => {
            setInvitations(res);
            setLoading(false);
        })
    }, [institutionId, application]);

    const openUser = entity => e => {
        stopEvent(e);
        navigate(`/invitation-detail/${entity.id}`);
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
        const allowed = isAllowed(AUTHORITIES.INVITER, user, institutionId) && isAllowed(AUTHORITIES[entity.intendedAuthority], user, institutionId);
        return allowed ? e => openUser(e) : null;
    }

    const columns = [
        {
            key: "email",
            header: I18n.t("users.email"),
            mapper: entity => entity.email,
        },
        {
            key: "authority",
            header: I18n.t("users.intendedAuthority"),
            mapper: entity => I18n.t(`users.authorities.${entity.intendedAuthority}`),
        },
        {
            key: "status",
            header: I18n.t("users.status"),
            mapper: entity => <span className={"open-invitation"}>{I18n.t(`users.statuses.open`)}</span>,
        },
        {
            key: "roles",
            sortable: false,
            header: I18n.t("users.roles"),
            mapper: entity => getRoles(entity),
        },
    ]

    return (
        <div className="invitations">
            <Entities entities={invitations}
                      modelName="invitations"
                      searchAttributes={["email"]}
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
export default Invitations;
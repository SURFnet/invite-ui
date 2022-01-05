import React from "react";
import I18n from "i18n-js";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import {AUTHORITIES, isSuperAdmin} from "../utils/authority";
import "./Institutions.scss";

const Institutions = ({user, institutions}) => {

    const navigate = useNavigate();

    const openInstitution = institution => e => {
        stopEvent(e);
        navigate(`/institution-detail/${institution.id}`);
    };

    const columns = [
        {
            key: "displayName",
            header: I18n.t("institutions.name"),
            mapper: institution => institution.displayName,
        },
        {
            key: "entityId",
            header: I18n.t("institutions.entityId"),
            mapper: institution => institution.entityId,
        },
        {
            key: "homeInstitution",
            header: I18n.t("institutions.homeInstitution"),
            mapper: institution => institution.homeInstitution,
        },
        {
            key: "aupUrl",
            header: I18n.t("institutions.aupUrl"),
            ignoreRowClick: true,
            mapper: institution => <a href={institution.aupUrl} target="_blank"
                                      rel="noreferrer">{institution.aupUrl}</a>,
        },

    ]
    return (
        <div className="institutions">
            <Entities entities={institutions}
                      modelName="institutions"
                      searchAttributes={["displayName", "homeInstitution", "entityId"]}
                      defaultSort="displayName"
                      columns={columns}
                      hideTitle={true}
                      rowLinkMapper={() => openInstitution}
                      showNew={isSuperAdmin(user)}
                      newEntityPath={"/institution/new"}
                      loading={false}/>
        </div>
    )

}
export default Institutions;
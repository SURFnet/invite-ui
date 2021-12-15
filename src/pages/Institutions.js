import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allInstitutions} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import {AUTHORITIES} from "../utils/authority";
import "./Institutions.scss";

const Institutions = ({user}) => {

    const [loading, setLoading] = useState(true);
    const [institutions, setInstitutions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        allInstitutions().then(res => {
            setInstitutions(res);
            setLoading(false);
        })
    }, []);

    const openInstitution = institution => e => {
        stopEvent(e);
        navigate(`/institution-detail/${institution.id}`);
    };

    if (loading) {
        return <Spinner/>
    }
    const columns = [
        {
            key: "displayName",
            header: I18n.t("institutions.displayName"),
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
            mapper: institution => <a href={institution.aupUrl} target="_blank" rel="noreferrer">{institution.aupUrl}</a> ,
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
                      showNew={user.authority === AUTHORITIES.SUPER_ADMIN.name}
                      newEntityPath={"/institution/new"}
                      loading={loading}/>
        </div>
    )

}
export default Institutions;
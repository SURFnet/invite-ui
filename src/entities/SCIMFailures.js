import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allSCIMFailuresByInstitution} from "../api/api";
import Spinner from "../components/Spinner";
import {stopEvent} from "../utils/forms";
import {useNavigate} from "react-router-dom";
import Entities from "../components/Entities";
import "./SCIMFailures.scss";
import {formatDate} from "../utils/date";

const SCIMFailures = ({institution}) => {

    const [loading, setLoading] = useState(true);
    const [failures, setFailures] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        allSCIMFailuresByInstitution(institution.id).then(res => {
            setFailures(res);
            setLoading(false);
        })
    }, [institution]);

    const openScimFailure = entity => e => {
        stopEvent(e);
        navigate(`/scim-failure-detail/${institution.id}/${entity.id}`);
    };

    if (loading) {
        return <Spinner/>
    }

    const showSchemaPart = entity => {
        const schema = JSON.parse(entity.message).schemas[0];
        return schema.substring(schema.lastIndexOf(":") + 1)
    }

    const columns = [
        {
            key: "message",
            header: I18n.t("scimFailures.message"),
            mapper: showSchemaPart,
        },
        {
            key: "httpMethod",
            header: I18n.t("scimFailures.httpMethod"),
            mapper: entity => entity.httpMethod,
        },
        {
            key: "uri",
            header: I18n.t("scimFailures.uri"),
            mapper: entity => new URL(entity.uri).origin,
        },
        {
            key: "application",
            header: I18n.t("scimFailures.application"),
            mapper: entity => entity.application.name,
        },
        {
            key: "createdAt",
            header: I18n.t("scimFailures.createdAt"),
            mapper: entity => formatDate(entity.createdAt),
        },
    ]

    return (
        <div className="scimFailures">
            <Entities title={I18n.t("scimFailures.title", {name: institution.displayName})}
                      entities={failures}
                      modelName="scimFailures"
                      searchAttributes={["message"]}
                      defaultSort="email"
                      columns={columns}
                      hideTitle={false}
                      rowLinkMapper={() => openScimFailure}
                      showNew={false}
                      loading={loading}/>
        </div>
    )

}
export default SCIMFailures;
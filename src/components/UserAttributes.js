import "./Header.scss";
import I18n from "i18n-js";
import React from "react";
import {formatDate} from "../utils/date";

const UserAttributes = ({user}) => {

    return (
        <>
            <div className={"attributes"}>
                <div>
                    <p className="attribute">{I18n.t("users.name")}</p>
                    <p>{`${user.givenName} ${user.familyName}`}</p>
                </div>
                <div>
                    <p className="attribute">{I18n.t("users.email")}</p>
                    <p>{user.email}</p>
                </div>
                <div>
                    <p className="attribute">{I18n.t("users.authority")}</p>
                    <p>{I18n.t(`users.authorities.${user.authority}`)}</p>
                </div>
                <div>
                    <p className="attribute">{I18n.t("profile.eppn")}</p>
                    <p>{user.eduPersonPrincipalName}</p>
                </div>
                <div>
                    <p className="attribute">{I18n.t("profile.created")}</p>
                    <p>{formatDate(user.createdAt)}</p>
                </div>
            </div>
            <div className={"attributes"}>
                <div className={"attribute-section"}>
                    <h2 className={"section-divider"}>{I18n.t("profile.institution")}</h2>
                    <p>{user.institution.displayName}</p>
                </div>
                <div className={"attribute-section"}>
                    <h2 className={"section-divider"}>{I18n.t("profile.roles")}</h2>

                    {user.roles.length > 0 && user.roles.map(role => <p
                        key={role.id}>{`${role.role.name} (${role.role.applicationName})`}</p>)}
                    {user.roles.length === 0 && <span>-</span>}
                </div>
            </div>
        </>
    );

}
export default UserAttributes;
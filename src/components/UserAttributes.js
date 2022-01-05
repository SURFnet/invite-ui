import "./Header.scss";
import I18n from "i18n-js";
import React from "react";
import {formatDate} from "../utils/date";

const UserAttributes = ({user}) => {

    const getRoles = institutionId => {
        return user.roles.filter(role => role.role.institutionId === institutionId);
    }

    const rolesGroupedByInstitution = user.institutionMemberships.reduce((acc, membership) => {
        acc[membership.institution.id] = getRoles(membership.institution.id);
        return acc;
    }, {})

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
                    <p className="attribute">{I18n.t("profile.eppn")}</p>
                    <p>{user.eduPersonPrincipalName}</p>
                </div>
                <div>
                    <p className="attribute">{I18n.t("profile.created")}</p>
                    <p>{formatDate(user.createdAt)}</p>
                </div>
            </div>
            <h2 className={"section-divider"}>
                {I18n.t(`profile.institution${user.institutionMemberships.length === 1 ? "" : "s"}`)}
            </h2>
            {user.institutionMemberships.length > 0 && <div>
                {user.institutionMemberships.map((membership, index) =>
                    <div key={index} className={`attributes ${index !== 0 ? "border-top" : ""}`}>
                        <div>
                            <p className="attribute">{I18n.t("institutions.name")}</p>
                            <p>{membership.institution.displayName}</p>
                        </div>
                        <div>
                            <p className="attribute">{I18n.t("institutions.homeInstitution")}</p>
                            <p>{membership.institution.homeInstitution}</p>
                        </div>
                        <div>
                            <p className="attribute">{I18n.t("users.authority")}</p>
                            <p>{I18n.t(`users.authorities.${membership.authority}`)}</p>
                        </div>
                        <div>
                            <p className="attribute">{I18n.t("profile.roles")}</p>
                            {rolesGroupedByInstitution[membership.institution.id].map(userRole =>
                                <p
                                    key={userRole.id}>{`${userRole.role.name} (${userRole.role.applicationName})`}</p>)}
                            {rolesGroupedByInstitution[membership.institution.id].length === 0 && <span>-</span>}
                        </div>
                    </div>
                )}
            </div>}
        </>
    );

}
export default UserAttributes;
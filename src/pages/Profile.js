import React from "react";
import "./Profile.scss";
import I18n from "i18n-js";
import {BreadCrumb} from "../components/BreadCrumb";
import {formatDate} from "../utils/date";

const Profile = ({user}) => {

    return (
        <div className={"profile-container"}>
            <BreadCrumb paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {
                    value: I18n.t("home.tabs.profile")
                }
            ]}/>
            <div className={"profile"}>
                <h2>
                    {I18n.t("profile.header", {name: `${user.givenName}`})}
                </h2>
                <p className="attribute">{I18n.t("users.name")}</p>
                <p>{`${user.givenName} ${user.familyName}`}</p>
                <p className="attribute">{I18n.t("users.email")}</p>
                <p>{user.email}</p>
                <p className="attribute">{I18n.t("users.authority")}</p>
                <p>{I18n.t(`users.authorities.${user.authority}`)}</p>
                <p className="attribute">{I18n.t("profile.eppn")}</p>
                <p>{user.eduPersonPrincipalName}</p>
                <p className="attribute">{I18n.t("profile.created")}</p>
                <p>{formatDate(user.createdAt)}</p>

                <h2 className={"section-divider"}>{I18n.t("profile.institution")}</h2>
                <p>{user.institution.displayName}</p>

                <h2 className={"section-divider"}>{I18n.t("profile.roles")}</h2>
                {user.roles.map(role => <p key={role.id}>{`${role.role.name} (${role.role.applicationName})`}</p>)}
            </div>
        </div>
    )
}
export default Profile
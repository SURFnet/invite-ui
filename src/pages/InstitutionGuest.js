import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import "./InstitutionGuest.scss";
import UnitHeader from "../components/UnitHeader";
import {mineInstitutions} from "../api/api";
import Spinner from "../components/Spinner";
import {BreadCrumb} from "../components/BreadCrumb";
import {isEmpty} from "../utils/forms";

const InstitutionGuest = ({user}) => {

    const [loading, setLoading] = useState(true);
    const [institutions, setInstitutions] = useState({});

    useEffect(() => {
        mineInstitutions().then(res => {
            setInstitutions(res);
            const invitationRolesJSON = sessionStorage.getItem("invitationRoles");
            if (!isEmpty(invitationRolesJSON)) {
                const invitationRoles = JSON.parse(invitationRolesJSON);
                user.roles.forEach(role => {
                    role.newRole = (res.find(institution => invitationRoles.institutionId === institution.id) &&
                        invitationRoles.newRoles.find(app => app.applicationName === role.role.applicationName &&
                            app.roleName === role.role.name));
                })
                sessionStorage.removeItem("invitationRoles");
            }
            setLoading(false);
        });
    }, [user]);

    if (loading) {
        return <Spinner/>
    }

    const renderApplications = institution => {
        return <div className={"guest-applications"}>
            <p className="attribute">{I18n.t("institutions.applications")}</p>
            {user.roles.filter(role => role.role.institutionId === institution.id).map((role, index) =>
                <p key={index}>
                    {role.newRole && <span className={"new-role"}>{I18n.t("institutions.newRole")}</span>}
                    <a href={role.role.applicationLandingPage}
                       target="_blank"
                       className={role.newRole ? "new-role" : ""}
                       rel="noreferrer">
                        {`${role.role.applicationName} (${role.role.name})`}
                    </a>
                </p>)}
        </div>;
    }

    return (
        <div className="institution-guest">
            <BreadCrumb paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {value: I18n.t("breadcrumbs.mineApplications")}
            ]}/>
            <UnitHeader>
                <div className="info">
                    {institutions.map(institution => <div>
                        <h2>{`${I18n.t("institutions.object")} ${institution.displayName}`}</h2>
                        {renderApplications(institution)}
                    </div>)}
                </div>
            </UnitHeader>
        </div>
    );

}
export default InstitutionGuest;
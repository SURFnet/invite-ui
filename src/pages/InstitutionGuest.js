import React, {useEffect, useState} from "react";
import I18n from "i18n-js";
import "./InstitutionGuest.scss";
import UnitHeader from "../components/UnitHeader";
import {mineInstitutions} from "../api/api";
import Spinner from "../components/Spinner";
import {BreadCrumb} from "../components/BreadCrumb";
import {isEmpty} from "../utils/forms";
import {formatDate} from "../utils/date";

const InstitutionGuest = ({user}) => {

    const [loading, setLoading] = useState(true);
    const [institutions, setInstitutions] = useState({});

    useEffect(() => {
        mineInstitutions().then(res => {
            setInstitutions(res);
            const invitationRolesJSON = sessionStorage.getItem("invitationRoles");
            if (!isEmpty(invitationRolesJSON)) {
                const invitationRoles = JSON.parse(invitationRolesJSON);
                user.userRoles.forEach(userRole => {
                    userRole.newRole = (res.find(institution => invitationRoles.institutionId === institution.id) &&
                        invitationRoles.newRoles.find(app => app.applicationName === userRole.role.application.name &&
                            app.roleName === userRole.role.name));
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
        const userRoles = user.userRoles.filter(userRole => userRole.role.application.institution.id === institution.id);
        return <div className={"guest-applications"}>
            {userRoles.length === 0 && <p className="attribute">{I18n.t("institutions.noApplications")}</p>}
            {userRoles.length > 0 && <p className="attribute">{I18n.t("institutions.applications")}</p>}
            {userRoles.map((userRole, index) =>
                <div key={index}>
                    <p>{userRole.newRole && <span className={"new-role"}>{I18n.t("institutions.newRole")}</span>}
                        <a href={userRole.role.application.landingPage}
                           target="_blank"
                           className={userRole.newRole ? "new-role" : ""}
                           rel="noreferrer">
                            {`${userRole.role.application.name} (${userRole.role.name})`}
                        </a>
                    </p>
                    {userRole.endDate ?
                        <em className="end-date">{I18n.t("institutions.endDate")}{formatDate(userRole.endDate)}</em> :
                        <em className="end-date">{I18n.t("profile.noEndDate")}</em>}
                </div>)}
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
                    {institutions.length === 0 &&
                    <div className={"disclaimer"}>
                        <p>{I18n.t("institutions.disclaimer")}</p>

                    </div>}
                </div>
            </UnitHeader>
        </div>
    );

}
export default InstitutionGuest;
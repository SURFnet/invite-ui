import "./Header.scss";
import I18n from "i18n-js";
import React, {useState} from "react";
import {formatDate} from "../utils/date";
import ConfirmationDialog from "./ConfirmationDialog";
import {deleteInstitutionMembership, deleteUserRole, me} from "../api/api";
import Button from "./Button";
import {useNavigate} from "react-router-dom";
import {setFlash} from "../flash/events";
import {AUTHORITIES, deleteInstitutionMembershipAllowed, deleteUserRoleAllowed} from "../utils/authority";
import {cookieStorage} from "../utils/storage";

const UserAttributes = ({user, isMe, authenticatedUser}) => {

    const navigate = useNavigate();

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const getRoles = institutionId => {
        return user.userRoles.filter(role => role.role.application.institution.id === institutionId);
    }

    const rolesGroupedByInstitution = user.institutionMemberships.reduce((acc, membership) => {
        acc[membership.institution.id] = getRoles(membership.institution.id);
        return acc;
    }, {})

    const refreshUser = navigateTo => {
        if (isMe) {
            me()
                .then(res => {
                    cookieStorage.setItem("user", JSON.stringify(res));
                    const path = encodeURIComponent(window.location.pathname);
                    navigate(`/refresh-route/${path}`, {replace: true});
                });
        } else {
            if (navigateTo) {
                navigate(navigateTo, {replace: true});
            } else {
                const path = encodeURIComponent(window.location.pathname);
                navigate(`/refresh-route/${path}`, {replace: true});
            }
        }
        setConfirmationOpen(false);
    }

    const doDeleteUserRole = (showConfirmation, userRole) => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDeleteUserRole(false, userRole),
                warning: true,
                question: I18n.t(`${isMe ? "profile" : "user"}.confirmation.deleteUserRole`, {
                    userRole: userRole.role.name,
                    name: user.name
                })
            });
            setConfirmationOpen(true);
        } else {
            deleteUserRole(user, userRole).then(() => {
                setFlash(I18n.t("user.flash.deleteUserRole", {name: userRole.role.name}));
                const navigateTo = (user.userRoles.length === 1 && user.institutionMemberships[0].authority === AUTHORITIES.GUEST.name) ?
                    `/institution-detail/${user.institutionMemberships[0].institution.id}/users` : null;
                refreshUser(navigateTo);
            })
        }
    };

    const doDeleteInstitutionMembership = (showConfirmation, institutionMembership) => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDeleteInstitutionMembership(false, institutionMembership),
                warning: true,
                question: I18n.t(`${isMe ? "profile" : "user"}.confirmation.deleteInstitutionMembership`, {
                    institution: institutionMembership.institution.displayName,
                    name: user.name
                })
            });
            setConfirmationOpen(true);
        } else {
            deleteInstitutionMembership(user, institutionMembership).then(() => {
                setFlash(I18n.t("user.flash.deleteInstitutionMembership"));
                refreshUser(`/institution-detail/${user.institutionMemberships[0].institution.id}/users`);
            })
        }
    };

    return (
        <>
            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

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
                        <div className={"user-role"}>
                            <div>
                                <p className="attribute">{I18n.t("institutions.homeInstitution")}</p>
                                <p>{membership.institution.homeInstitution}</p>
                            </div>
                            {deleteInstitutionMembershipAllowed(authenticatedUser, user, membership) &&
                            <Button className={"user-role-delete"}
                                    warningButton={true}
                                    txt={I18n.t("forms.delete")}
                                    onClick={() => doDeleteInstitutionMembership(true, membership)}/>}
                        </div>
                        <div>
                            <p className="attribute">{I18n.t("users.authority")}</p>
                            <p>{I18n.t(`users.authorities.${membership.authority}`)}</p>
                        </div>
                        <div>
                            <p className="attribute">{I18n.t("profile.roles")}</p>
                            {rolesGroupedByInstitution[membership.institution.id].map(userRole =>
                                <div className={"user-role is-role"} key={userRole.id}>
                                    <div>
                                        <p>{`${userRole.role.name} (${userRole.role.application.name})`}</p>
                                        {userRole.endDate &&
                                        <p>{I18n.t("profile.endDate")}<em>{formatDate(userRole.endDate)}</em></p>}
                                        {!userRole.endDate && <p>{I18n.t("profile.noEndDate")}</p>}
                                        <p>{I18n.t("profile.inviter")}<em>{userRole.inviter || I18n.t("profile.noInviter")}</em></p>
                                    </div>
                                    {deleteUserRoleAllowed(authenticatedUser, user, userRole) &&
                                    <Button warningButton={true} txt={I18n.t("forms.delete")}
                                            onClick={() => doDeleteUserRole(true, userRole)}/>}
                                </div>
                            )}
                            {rolesGroupedByInstitution[membership.institution.id].length === 0 && <span>-</span>}
                        </div>
                    </div>
                )}
            </div>}
        </>
    );

}
export default UserAttributes;
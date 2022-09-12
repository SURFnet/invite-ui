//Internal API
import {refreshTokens} from "./frontChannelTokenRequest";
import {isEmpty} from "../utils/forms";
import {cookieStorage} from "../utils/storage";

//Internal API
const serverUrl = window.config.serverUrl;

function validateResponse(showErrorDialog) {
    return res => {
        if (!res.ok) {
            if (res.status === 401) {
                //Need to get a new accessToken and reload the page
                refreshTokens().then(json => {
                    cookieStorage.setItem("accessToken", json.access_token);
                    cookieStorage.setItem("refreshToken", json.refresh_token);
                    window.location.reload(true);
                })
                return;
            }
            if (res.type === "opaqueredirect") {
                setTimeout(() => window.location.reload(true), 100);
                return res;
            }
            const error = new Error(res.statusText);
            error.response = res;
            if (showErrorDialog) {
                setTimeout(() => {
                    throw error;
                }, 250);
            }
            throw error;
        }
        return res;
    };
}

function validFetch(path, options, headers = {}, showErrorDialog = true) {
    const contentHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...headers
    };
    const token = cookieStorage.getItem("accessToken");
    if (token) {
        contentHeaders["Authorization"] = `Bearer ${token}`;
    }
    const fetchOptions = Object.assign({}, {headers: contentHeaders}, options, {
        credentials: "same-origin",
        redirect: "manual"
    });
    return fetch(`${serverUrl}${path}`, fetchOptions).then(validateResponse(showErrorDialog))
}

function fetchJson(path, options = {}, headers = {}, showErrorDialog = true) {
    return validFetch(path, options, headers, showErrorDialog)
        .then(res => res.json());
}

function postPutJson(path, body, method, showErrorDialog = true) {
    return fetchJson(path, {method: method, body: JSON.stringify(body)}, {}, showErrorDialog);
}

function fetchDelete(path, showErrorDialog = true) {
    return validFetch(path, {method: "delete"}, {}, showErrorDialog);
}

//Base
export function oauth() {
    return postPutJson("/api/v1/public/authorize", {}, "POST");
}

//Users
export function me() {
    return fetchJson("/api/v1/users/me", {}, {}, false);
}

export function other(userId) {
    return fetchJson(`/api/v1/users/${userId}`, {}, {}, false);
}

export function allUsersByInstitution(institutionId) {
    return fetchJson(`/api/v1/users/institution/${institutionId}`);
}

export function allGuestEmailsByInstitution(institutionId) {
    return fetchJson(`/api/v1/users/emails/${institutionId}`);
}

export function allUsersByApplication(applicationId) {
    return fetchJson(`/api/v1/users/application/${applicationId}`);
}

export function deleteMe() {
    return fetchDelete(`/api/v1/users`);
}

export function deleteOther(otherUser) {
    return fetchDelete(`/api/v1/users/${otherUser.id}`);
}

export function deleteUserRole(user, userRole) {
    return fetchDelete(`/api/v1/users/role/${user.id}/${userRole.id}`);
}

export function deleteInstitutionMembership(user, membership) {
    return fetchDelete(`/api/v1/users/membership/${user.id}/${membership.id}`);
}

//Institutions
export function allInstitutions() {
    return fetchJson("/api/v1/institutions");
}

export function mineInstitutions() {
    return fetchJson("/api/v1/institutions/mine");
}

export function institutionById(id) {
    return fetchJson(`/api/v1/institutions/${id}`);
}

export function institutionUserCount(id) {
    return fetchJson(`/api/v1/institutions/user-count/${id}`);
}

export function institutionEntityIdExists(entityId, isExisting) {
    return postPutJson("/api/v1/institutions/entity-id-exists", {
        existingObject: isExisting,
        uniqueAttribute: entityId
    }, "post");
}

export function institutionSchacHomeExists(schacHome, isExisting) {
    return postPutJson("/api/v1/institutions/schac-home-exists", {
        existingObject: isExisting,
        uniqueAttribute: schacHome
    }, "post");
}

export function incrementAup(institution) {
    return postPutJson(`/api/v1/institutions/increment-aup/${institution.id}`, {}, "put");
}

export function saveInstitution(institution) {
    return postPutJson("/api/v1/institutions", institution, isEmpty(institution.id) ? "post" : "put");
}

export function deleteInstitution(institution) {
    return fetchDelete(`/api/v1/institutions/${institution.id}`);
}

//Applications
export function applicationsByInstitution(institutionId) {
    return fetchJson(`/api/v1/applications/institution/${institutionId}`);
}

export function applicationById(id) {
    return fetchJson(`/api/v1/applications/${id}`);
}

export function applicationEntityIdExists(entityId, isExisting, institutionId) {
    return postPutJson("/api/v1/applications/entity-id-exists", {
        existingObject: isExisting,
        uniqueAttribute: entityId,
        institutionId: institutionId,
    }, "post");
}

export function saveApplication(application) {
    return postPutJson("/api/v1/applications", application, "post");
}


export function deleteApplication(application) {
    return fetchDelete(`/api/v1/applications/${application.id}`);
}

export function applicationUserCount(id) {
    return fetchJson(`/api/v1/applications/user-count/${id}`);
}

//Roles
export function allRolesByInstitution(institutionId) {
    return fetchJson(`/api/v1/roles/institution/${institutionId}`);
}

export function allRolesByApplication(applicationId) {
    return fetchJson(`/api/v1/roles/application/${applicationId}`);
}

export function roleById(roleId) {
    return fetchJson(`/api/v1/roles/${roleId}`);
}

export function roleNameExists(name, isExisting, applicationId) {
    return postPutJson("/api/v1/roles/name-exists", {
        existingObject: isExisting,
        uniqueAttribute: name,
        applicationId: applicationId
    }, "post");
}

export function saveRole(role) {
    return postPutJson("/api/v1/roles", role, "post");
}

export function deleteRole(role) {
    return fetchDelete(`/api/v1/roles/${role.id}`);
}

//Validations
export function validate(type, value) {
    return postPutJson("/api/v1/validations/validate", {type, value}, "post");
}

//Invitations
export function invitationByHash(hash) {
    return fetchJson(`/api/v1/invitations/${hash}`, {}, {}, false);
}

export function invitationById(invitationId) {
    return fetchJson(`/api/v1/invitations/id/${invitationId}`, {}, {}, false);
}

export function createInvitation(invitationRequest) {
    return postPutJson("/api/v1/invitations", invitationRequest, "put");
}

export function acceptInvitation(invitation) {
    return postPutJson("/api/v1/invitations", invitation, "post", false);
}

export function resendInvitation(invitation) {
    return postPutJson("/api/v1/invitations/resend", invitation, "put");
}

export function updateInvitation(invitation) {
    return postPutJson("/api/v1/invitations/update-expiry-date", invitation, "put");
}

export function deleteInvitation(invitationId) {
    return fetchDelete(`/api/v1/invitations/${invitationId}`);
}

export function allInvitationsByInstitution(institutionId) {
    return fetchJson(`/api/v1/invitations/institution/${institutionId}`);
}

export function allInvitationsByApplication(applicationId) {
    return fetchJson(`/api/v1/invitations/application/${applicationId}`);
}

//Aup
export function acceptAups(membershipsWithoutAup) {
    const institutionIdentifiers = membershipsWithoutAup.map(membership => membership.institution.id)
    return postPutJson("/api/v1/aups", institutionIdentifiers, "put");
}

//SCIM
export function allSCIMFailuresByInstitution(institutionId) {
    return fetchJson(`/api/v1/scim/institution/${institutionId}`);
}

export function countSCIMFailuresByInstitution(institutionId) {
    return fetchJson(`/api/v1/scim/institution/${institutionId}/count`);
}

export function scimFailureById(id, institutionId) {
    return fetchJson(`/api/v1/scim/id/${id}/${institutionId}`);
}

export function deleteScimFailure(id, institutionId) {
    return fetchDelete(`/api/v1/scim/id/${id}/${institutionId}`);
}

export function resendScimFailure(id, institutionId) {
    return postPutJson(`/api/v1/scim/id/${id}/${institutionId}`,{}, "put", false);
}

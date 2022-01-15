//Internal API
import {refreshTokens} from "./frontChannelTokenRequest";
import {isEmpty} from "../utils/forms";

//Internal API
const config = window.config;
const serverUrl = config.serverUrl;

function validateResponse(showErrorDialog) {
    return res => {
        if (!res.ok) {
            if (res.status === 401) {
                //Need to get a new accessToken and reload the page
                refreshTokens().then(json => {
                    sessionStorage.setItem("accessToken", json.access_token);
                    sessionStorage.setItem("refreshToken", json.refresh_token);
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
    const token = sessionStorage.getItem("accessToken");
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
    return postPutJson("/guests/api/public/authorize", {}, "POST");
}

//Users
export function me() {
    return fetchJson("/guests/api/users/me", {}, {}, false);
}

export function other(userId) {
    return fetchJson(`/guests/api/users/${userId}`, {}, {}, false);
}

export function allUsersByInstitution(institutionId) {
    return fetchJson(`/guests/api/users/institution/${institutionId}`);
}

export function allGuestEmailsByInstitution(institutionId) {
    return fetchJson(`/guests/api/users/emails/${institutionId}`);
}

export function allUsersByApplication(applicationId) {
    return fetchJson(`/guests/api/users/application/${applicationId}`);
}

export function deleteMe() {
    return fetchDelete(`/guests/api/users`);
}

export function deleteOther(otherUser) {
    return fetchDelete(`/guests/api/users/${otherUser.id}`);
}

export function deleteUserRole(user, userRole) {
    return fetchDelete(`/guests/api/users/${user.id}/${userRole.id}`);
}

//Institutions
export function allInstitutions() {
    return fetchJson("/guests/api/institutions");
}

export function mineInstitutions() {
    return fetchJson("/guests/api/institutions/mine");
}

export function institutionById(id) {
    return fetchJson(`/guests/api/institutions/${id}`);
}

export function institutionEntityIdExists(entityId, isExisting) {
    return postPutJson("/guests/api/institutions/entity-id-exists", {
        existingObject: isExisting,
        uniqueAttribute: entityId
    }, "post");
}

export function institutionSchacHomeExists(schacHome, isExisting) {
    return postPutJson("/guests/api/institutions/schac-home-exists", {
        existingObject: isExisting,
        uniqueAttribute: schacHome
    }, "post");
}

export function incrementAup(institution) {
    return postPutJson(`/guests/api/institutions/increment-aup/${institution.id}`, {}, "put");
}

export function saveInstitution(institution) {
    return postPutJson("/guests/api/institutions", institution, isEmpty(institution.id) ? "post" : "put");
}

export function deleteInstitution(institution) {
    return fetchDelete(`/guests/api/institutions/${institution.id}`);
}

//Applications
export function applicationsByInstitution(institutionId) {
    return fetchJson(`/guests/api/applications/institution/${institutionId}`);
}

export function applicationById(id) {
    return fetchJson(`/guests/api/applications/${id}`);
}

export function applicationEntityIdExists(entityId, isExisting, institutionId) {
    return postPutJson("/guests/api/applications/entity-id-exists", {
        existingObject: isExisting,
        uniqueAttribute: entityId,
        institutionId: institutionId,
    }, "post");
}

export function saveApplication(application) {
    return postPutJson("/guests/api/applications", application, "post");
}


export function deleteApplication(application) {
    return fetchDelete(`/guests/api/applications/${application.id}`);
}


//Roles
export function allRolesByInstitution(institutionId) {
    return fetchJson(`/guests/api/roles/institution/${institutionId}`);
}

export function allRolesByApplication(applicationId) {
    return fetchJson(`/guests/api/roles/application/${applicationId}`);
}

export function roleById(roleId) {
    return fetchJson(`/guests/api/roles/${roleId}`);
}

export function roleNameExists(name, isExisting, applicationId) {
    return postPutJson("/guests/api/roles/name-exists", {
        existingObject: isExisting,
        uniqueAttribute: name,
        applicationId: applicationId
    }, "post");
}

export function saveRole(role) {
    return postPutJson("/guests/api/roles", role, "post");
}

export function deleteRole(role) {
    return fetchDelete(`/guests/api/roles/${role.id}`);
}

//Validations
export function validate(type, value) {
    return postPutJson("/guests/api/validations/validate", {type, value}, "post");
}

//Invitations
export function invitationByHash(hash) {
    return fetchJson(`/guests/api/invitations/${hash}`, {}, {}, false);
}

export function invitationById(invitationId) {
    return fetchJson(`/guests/api/invitations/id/${invitationId}`, {}, {}, false);
}

export function createInvitation(invitationRequest) {
    return postPutJson("/guests/api/invitations", invitationRequest, "put");
}

export function acceptInvitation(invitation) {
    return postPutJson("/guests/api/invitations", invitation, "post", false);
}

export function resendInvitation(invitation) {
    return postPutJson("/guests/api/invitations/resend", invitation, "put");
}

export function updateInvitation(invitation) {
    return postPutJson("/guests/api/invitations/update-expiry-date", invitation, "put");
}

export function deleteInvitation(invitationId) {
    return fetchDelete(`/guests/api/invitations/${invitationId}`);
}

export function allInvitationsByInstitution(institutionId) {
    return fetchJson(`/guests/api/invitations/institution/${institutionId}`);
}

export function allInvitationsByApplication(applicationId) {
    return fetchJson(`/guests/api/invitations/application/${applicationId}`);
}

//Aup
export function acceptAups(membershipsWithoutAup) {
    const institutionIdentifiers = membershipsWithoutAup.map(membership => membership.institution.id)
    return postPutJson("/guests/api/aups", institutionIdentifiers, "put");
}

//SCIM
export function allSCIMFailuresByInstitution(institutionId) {
    return fetchJson(`/guests/api/scim/institution/${institutionId}`);
}

export function countSCIMFailuresByInstitution(institutionId) {
    return fetchJson(`/guests/api/scim/institution/${institutionId}/count`);
}

export function scimFailureById(id, institutionId) {
    return fetchJson(`/guests/api/scim/id/${id}/${institutionId}`);
}

export function deleteScimFailure(id, institutionId) {
    return fetchDelete(`/guests/api/scim/id/${id}/${institutionId}`);
}

export function resendScimFailure(id, institutionId) {
    return postPutJson(`/guests/api/scim/id/${id}/${institutionId}`,{}, "put", false);
}

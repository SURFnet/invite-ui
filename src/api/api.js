//Internal API
import {refreshTokens} from "./frontChannelTokenRequest";
import {config} from "../conf/server";

//Internal API
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

export function allUsersByInstitution(institutionId) {
    return fetchJson(`/guests/api/users/institution/${institutionId}`, {}, {}, false);
}

//Institutions
export function allInstitutions() {
    return fetchJson("/guests/api/institutions");
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

export function saveInstitution(institution) {
    return postPutJson("/guests/api/institutions", institution, "post");
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

export function applicationEntityIdExists(entityId, isExisting) {
    return postPutJson("/guests/api/applications/entity-id-exists", {
        existingObject: isExisting,
        uniqueAttribute: entityId
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

export function roleById(id) {
    return fetchJson(`/guests/api/roles/${id}`);
}

export function roleNameExists(name, isExisting, applicationId) {
    return postPutJson("/guests/api/roles/entity-id-exists", {
        existingObject: isExisting,
        uniqueAttribute: name,
        applicationId: applicationId
    }, "post");
}

export function newRole(role) {
    return postPutJson("/guests/api/roles", role, "post");
}

export function updateRole(role) {
    return postPutJson("/guests/api/roles", role, "put");
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
    return fetchJson(`/guests/api/invitationss/${hash}`, {}, {}, false);
}

export function allInvitationsByInstitution(institutionId) {
    return fetchJson(`/guests/api/invitations/institution/${institutionId}`, {}, {}, false);
}


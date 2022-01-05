import {isEmpty} from "./forms";

export const AUTHORITIES = {
    SUPER_ADMIN: {name: "SUPER_ADMIN", weight: 4},
    INSTITUTION_ADMINISTRATOR: {name: "INSTITUTION_ADMINISTRATOR", weight: 3},
    INVITER: {name: "INVITER", weight: 2},
    GUEST: {name: "GUEST", weight: 1},
}

export const isSuperAdmin = user => {
    return user.institutionMemberships.some(membership => membership.authority === AUTHORITIES.SUPER_ADMIN.name);
}

export const isAllowed = (requiredAuthority, user, institutionId) => {
    if (isSuperAdmin(user)) {
        return true;
    }
    const membership = user.institutionMemberships.find(membership => membership.institution.id === institutionId);
    return membership && AUTHORITIES[membership.authority].weight >= requiredAuthority.weight;
}

export const isAllowedForInviter = (requiredAuthority, user, institutionId) => {
    if (isSuperAdmin(user)) {
        return true;
    }
    const membership = user.institutionMemberships.find(membership => membership.institution.id === institutionId);
    if (isEmpty(membership)) {
        return false;
    }
    if (membership.authority === AUTHORITIES.INVITER.name) {
        return AUTHORITIES.INVITER.weight > requiredAuthority.weight;
    }
    return true;
}

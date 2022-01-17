export const AUTHORITIES = {
    SUPER_ADMIN: {name: "SUPER_ADMIN", weight: 4},
    INSTITUTION_ADMINISTRATOR: {name: "INSTITUTION_ADMINISTRATOR", weight: 3},
    INVITER: {name: "INVITER", weight: 2},
    GUEST: {name: "GUEST", weight: 1},
}

export const isSuperAdmin = user =>
    user.institutionMemberships.some(membership => membership.authority === AUTHORITIES.SUPER_ADMIN.name);

export const isOnlyGuest = user =>
    user.institutionMemberships.every(membership => membership.authority === AUTHORITIES.GUEST.name);

export const isInviteAllowed = (intendedAuthority, user, institutionId) => {
    if (isSuperAdmin(user)) {
        return true;
    }
    const institutionIdentifier = parseInt(institutionId, 10);
    const membership = user.institutionMemberships.find(membership => membership.institution.id === institutionIdentifier);
    return membership && AUTHORITIES[membership.authority].weight > intendedAuthority.weight;
}

export const isAllowed = (requiredAuthority, user, institutionId) => {
    if (isSuperAdmin(user)) {
        return true;
    }
    const institutionIdentifier = parseInt(institutionId, 10);
    const membership = user.institutionMemberships.find(membership => membership.institution.id === institutionIdentifier);
    return membership && AUTHORITIES[membership.authority].weight >= requiredAuthority.weight;
}

export const isAllowedForInviter = (requiredAuthority, user, institutionId) => {
    if (isSuperAdmin(user)) {
        return true;
    }
    const institutionIdentifier = parseInt(institutionId, 10);
    const membership = user.institutionMemberships.find(membership => membership.institution.id === institutionIdentifier);
    if (membership && membership.authority === AUTHORITIES.INVITER.name) {
        return AUTHORITIES.INVITER.weight > requiredAuthority.weight;
    }
    return membership && AUTHORITIES[membership.authority].weight >= requiredAuthority.weight;
}

export const deleteOtherUserAllowed = (authenticatedUser, other) => {
    return other.id === authenticatedUser.id || isSuperAdmin(authenticatedUser);
}


const doDeleteUserRoleOrMembershipAllowed = (authenticatedUser, subject, institutionId, highestAuthority) => {
    if (isSuperAdmin(authenticatedUser) || authenticatedUser.id === subject.id) {
        return true;
    }
    const allowed = authenticatedUser.institutionMemberships
        .some(membership => membership.institution.id === institutionId &&
            AUTHORITIES[membership.authority].weight > highestAuthority.weight);
    return allowed;
}

export const viewOtherUserAllowed = (authenticatedUser, subject) => {
    if (isSuperAdmin(authenticatedUser) || authenticatedUser.id === subject.id) {
        return true;
    }
    return authenticatedUser.institutionMemberships
        .some(membership => subject.institutionMemberships
            .some(subjectMembership => subjectMembership.institution.id === membership.institution.id &&
                AUTHORITIES[membership.authority].weight > AUTHORITIES[subjectMembership.authority].weight));
}


export const deleteUserRoleAllowed = (authenticatedUser, subject, subjectUserRole) => {
    const institutionId = subjectUserRole.role.application.institution.id;
    const highestAuthority = subject.institutionMemberships
        .map(membership => membership.authority)
        .reduce((prev, current) =>
            (AUTHORITIES[prev].weight > AUTHORITIES[current].weight) ? prev : current)
    return doDeleteUserRoleOrMembershipAllowed(authenticatedUser, subject, institutionId, AUTHORITIES[highestAuthority]);
}

export const deleteInstitutionMembershipAllowed = (authenticatedUser, subject, institutionMembership) => {
    const institutionId = institutionMembership.institution.id;
    return doDeleteUserRoleOrMembershipAllowed(authenticatedUser, subject, institutionId, AUTHORITIES[institutionMembership.authority]);
}


export const AUTHORITIES = {
    SUPER_ADMIN: {name: "SUPER_ADMIN", weight: 4},
    INSTITUTION_ADMINISTRATOR: {name: "INSTITUTION_ADMINISTRATOR", weight: 3},
    INVITER: {name: "INVITER", weight: 2},
    GUEST: {name: "GUEST", weight: 1},
}

export const isAllowed = (requiredAuthority, user) => {
    return AUTHORITIES[user.authority].weight >= requiredAuthority.weight;
}

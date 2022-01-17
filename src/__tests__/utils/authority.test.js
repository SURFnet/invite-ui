import {
    AUTHORITIES,
    deleteInstitutionMembershipAllowed,
    deleteOtherUserAllowed,
    deleteUserRoleAllowed,
    isAllowed,
    isAllowedForInviter,
    isInviteAllowed,
    isOnlyGuest,
    isSuperAdmin,
    viewOtherUserAllowed
} from "../../utils/authority";

test("is super admin", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.SUPER_ADMIN.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isSuperAdmin(user);
    expect(val).toBe(true);
});

test("is guest", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.GUEST.name,
                institution: {id: 1}
            },
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isOnlyGuest(user);
    expect(val).toBe(false);
});

test("is allowed", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.SUPER_ADMIN.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isAllowed(AUTHORITIES.SUPER_ADMIN, user, 1);
    expect(val).toBe(true);
});

test("is not allowed", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, 1);
    expect(val).toBe(false);
});

test("Inviter can not invite other Inviters", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isInviteAllowed(AUTHORITIES.INVITER, user, 1);
    expect(val).toBe(false);
});

test("Inviter can invite Guests", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isInviteAllowed(AUTHORITIES.GUEST, user, 1);
    expect(val).toBe(true);
});

test("Allowed for inviters", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isAllowedForInviter(AUTHORITIES.GUEST, user, 1);
    expect(val).toBe(true);
});

test("Not allowed for inviters", () => {
    const user = {
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = isAllowedForInviter(AUTHORITIES.INVITER, user, 1);
    expect(val).toBe(false);
});

test("Super admin is allowed everything", () => {
    const user = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.SUPER_ADMIN.name,
                institution: {id: 1}
            }
        ]
    };
    [isInviteAllowed, isAllowed, isAllowedForInviter].forEach(method => {
        const val = method(AUTHORITIES.SUPER_ADMIN, user, 1);
        expect(val).toBe(true);
    });
    expect(deleteOtherUserAllowed(user, {})).toBe(true);
});

test("Delete other not allowed", () => {
    const user = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name,
                institution: {id: 1}
            }
        ]
    };
    const val = deleteOtherUserAllowed(user, {});
    expect(val).toBe(false);
});

test("Delete myself allowed", () => {
    const user = {
        id: 1
    };
    const val = deleteOtherUserAllowed(user, user);
    expect(val).toBe(true);
});

test("Delete user role allowed", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {
        id: 2,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const userRole = {
        role: {
            application: {
                institution: {id: 1}
            }
        }
    }
    const val = deleteUserRoleAllowed(authenticatedUser, subject, userRole);
    expect(val).toBe(true);
});

test("Delete user role not allowed", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {
        id: 2,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name,
                institution: {id: 1}
            }
        ]
    };
    const userRole = {
        role: {
            application: {
                institution: {id: 1}
            }
        }
    }
    const val = deleteUserRoleAllowed(authenticatedUser, subject, userRole);
    expect(val).toBe(false);
});

test("Delete user role allowed for own user role", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.GUEST.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.GUEST.name,
                institution: {id: 1}
            }
        ]
    };
    const userRole = {
        role: {
            application: {
                institution: {id: 1}
            }
        }
    }
    const val = deleteUserRoleAllowed(authenticatedUser, subject, userRole);
    expect(val).toBe(true);
});

test("Delete institution Guest membership allowed for inviters", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {};
    const institutionMembership = {
        institution: {
            id: 1
        },
        authority: AUTHORITIES.GUEST.name
    }
    const val = deleteInstitutionMembershipAllowed(authenticatedUser, subject, institutionMembership);
    expect(val).toBe(true);
});

test("Delete institution membership not allowed", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {};
    const institutionMembership = {
        institution: {
            id: 1
        },
        authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name
    }
    const val = deleteInstitutionMembershipAllowed(authenticatedUser, subject, institutionMembership);
    expect(val).toBe(false);
});

test("Delete institution membership allowed", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {};
    const institutionMembership = {
        institution: {
            id: 1
        },
        authority: AUTHORITIES.INVITER.name
    }
    const val = deleteInstitutionMembershipAllowed(authenticatedUser, subject, institutionMembership);
    expect(val).toBe(true);
});

test("Delete view other not allowed", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {
        id: 2,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = viewOtherUserAllowed(authenticatedUser, subject);
    expect(val).toBe(false);
});

test("Delete view other not allowed other institution", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {
        id: 2,
        institutionMemberships: [
            {
                authority: AUTHORITIES.GUEST.name,
                institution: {id: 2}
            }
        ]
    };
    const val = viewOtherUserAllowed(authenticatedUser, subject);
    expect(val).toBe(false);
});

test("Delete view other allowed", () => {
    const authenticatedUser = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INSTITUTION_ADMINISTRATOR.name,
                institution: {id: 1}
            }
        ]
    };
    const subject = {
        id: 1,
        institutionMemberships: [
            {
                authority: AUTHORITIES.INVITER.name,
                institution: {id: 1}
            }
        ]
    };
    const val = viewOtherUserAllowed(authenticatedUser, subject);
    expect(val).toBe(true);
});

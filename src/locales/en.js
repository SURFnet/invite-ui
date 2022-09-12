import I18n from "i18n-js";

I18n.translations.en = {

    header: {
        title: "Invites",
        afterLogout: "You must close your browser to complete the logout",
        confirmationHeader: "Close your browser"
    },
    home: {
        tabs: {
            institutions: "Institutions",
            applications: "Applications",
            roles: "Roles",
            profile: "Profile",
            users: "Users",
            invitations: "Invitations",
            scimFailures: "SCIM"
        }
    },
    breadcrumbs: {
        home: "Home",
        mineApplications: "Mine applications"
    },
    institutions: {
        title: "Institutions",
        name: "Name",
        namePlaceholder: "Unique name of the institution, e.g. Univiersity Foo",
        displayName: "Description",
        object: "Institution",
        entityId: "Entity ID",
        entityIdPlaceholder: "Unique entityID, e.g. https://foo.nl",
        homeInstitution: "Schac home",
        homeInstitutionPlaceholder: "Unique schac home, e.g. foo.nl",
        aupUrl: "AUP Url",
        aupUrlPlaceholder: "User Acceptance URL, e.g. https://foo.nl/aup",
        searchPlaceHolder: "Search institutions",
        new: "New institution",
        noEntities: "There are no institutions...",
        applications: "Applications",
        noApplications: "No applications",
        newRole: "New - ",
        endDate: "Ends on ",
        aup: {
            increment: "new AUP",
            confirmation: "Are you sure you want to increment the version of the AUP? All users will be prompted to confirm acceptance of the new AUP when they login.",
            flash: "AUP version is incremented"
        },
        disclaimer: "You are not a member any more of an institution. Please contact your institution admin if this surprises you."
    },
    users: {
        title: "Users",
        name: "Name",
        object: "User",
        email: "Email",
        roles: "Roles",
        authority: "Authority",
        intendedAuthority: "Intended authority",
        expires: " - expires {{date}}",
        authorities: {
            SUPER_ADMIN: "Super admin",
            INSTITUTION_ADMINISTRATOR: "Institution admin",
            INVITER: "Inviter",
            GUEST: "Guest"
        },
        searchPlaceHolder: "Search users",
        new: "New invite",
        noEntities: "There are no users...",
        status: "Status",
        statuses: {
            open: "Open - expires {{date}}",
            expired: "Expired on {{date}}",
        }
    },
    applications: {
        title: "Applications",
        name: "Name",
        namePlaceholder: "Name of the application",
        displayName: "Description",
        displayNamePlaceholder: "Description of the application",
        object: "Application",
        entityId: "Entity ID",
        entityIdPlaceholder: "Entity ID of the application, as known in SURFconext",
        provisioning: "Provisioning",
        noProvisioning: "None",
        landingPage: "Landing page URL",
        landingPagePlaceholder: "Landing page of the application",
        provisioningHookUrl: "Provisioning hook URL",
        updateRolePutMethod: "Use SCIM PUT hook (default PATCH)",
        updateRolePutMethodTooltip: "If checked then a PUT call is made to the provisioning URL with all the users with this role, otherwise a PATCH is made with only the delta (e.g. the user-role which was added or deleted)",
        provisioningHookUrlPlaceholder: "SCIM endpoint URL of the application, e.g. https://university.nl/scim/v1",
        provisioningHookUsername: "Provisioning hook username",
        provisioningHookUsernamePlaceholder: "Provisioning hook username of the application",
        provisioningHookPassword: "Provisioning hook password",
        provisioningHookPasswordPlaceholder: "Provisioning hook password of the application",
        provisioningHookEmail: "Provisioning hook email",
        provisioningHookEmailPlaceholder: "Provisioning hook email of the application",
        searchPlaceHolder: "Search applications",
        new: "New application",
        noEntities: "There are no applications...",
        conflictProvisioning: "You can not both configure a provisioningHookUrl and a provisioningHookEmail"
    },
    roles: {
        name: "Name",
        namePlaceholder: "Name of the role",
        displayName: "Description",
        displayNamePlaceholder: "Description of the role",
        applicationName: "Application",
        urn: "URN",
        new: "New role",
        searchPlaceHolder: "Search roles",
        noEntities: "There are no roles...",
        alreadyExists: "A Role with name {{value}} already exists for application {{application}}.",
        object: "Role",
        application: "Application",
        authority: "Authority",
        authorityTooltip: "The authority determines which users can invite people for this role",
        defaultExpiryDays: "Default expiry days",
        defaultExpiryDaysPlaceholder: "e.g. 14 days",
        defaultExpiryDaysTooltip: "A default role validity time (in days) determines the date for expiry date role, this can be edited when sending the invite",
    },
    scimFailures: {
        title: "All SCIM failures",
        message: "Message",
        httpMethod: "HTTP",
        api: {
            name: "API",
            users: "Users",
            groups: "Groups"
        },
        createdAt: "Date",
        application: "Application",
        uri: "URI",
        searchPlaceHolder: "Search failures",
        serviceProviderId: "External reference ID",
        noEntities: "Fortunately there are no SCIM failures...",
        details: "SCIM failure details",
        path: "SCIM failures",
        failure: "Failure",
        flash: {
            deleted: "SCIM failure has been deleted.",
            resend: "SCIM failure has been resend."
        },
        confirmation: {
            delete: "Are you sure you want to delete this SCIM failure? This can not be undone.",
            resend: "Are you sure you want to resend this SCIM failure?"
        },
        error: "The resending failed and the SCIM failure is not deleted. Root cause: {{msg}}"
    },
    confirmationDialog: {
        title: "Please confirm",
        confirm: "Confirm",
        cancel: "Cancel",
        questions: {
            delete: "Are you sure you want to delete {{object}} {{name}}?"
        }
    },
    forms: {
        cancel: "Cancel",
        delete: "Delete",
        submit: "Submit",
        save: "Save",
        update: "Update",
        edit: "Edit",
        createdAt: "Created",
        new: "New {{object}}",
        editObject: "Edit {{name}}",
        required: "{{attribute}} is a required attribute",
        alreadyExists: "An {{object}} with {{attribute}} {{value}} already exists.",
        invalid: "{{value}} for {{attribute}} is invalid.",
        flash: {
            created: "Created {{object}} {{name}}",
            updated: "Updated {{object}} {{name}}",
            deleted: "Deleted {{object}} {{name}}"
        },
        nameTooltip: "The name of the {{object}} is part of the group membership URN that is send to services. Therefore it may not contain spaces or other non-asci characters.",
        provisioningHookUrlTooltip: "The provisioning URL including the path. E.g. https://university.nl/scim/v1"
    },
    invitations: {
        new: "New invite",
        invitees: "Invitees",
        inviteesPlaceholder: "Invitee email addresses",
        inviteesTooltip: "Add email addresses separated by comma, space or semi-colon or one-by-one using the enter key. You can also copy & paste a csv file with line-separated email addresses.",
        requiredEmail: "At least one email is required",
        requiredRole: "At least one role is required for a guest invitation",
        intendedAuthority: "Authority",
        intendedAuthorityTooltip: "The authority determines the rights the invitee will be granted after accepting the invitation",
        roles: "Roles",
        rolesTooltip: "All the roles that the invitee will be granted after accepting the invitation",
        rolesPlaceHolder: "Choose one or more roles",
        expiryDate: "Invitation expiry date",
        expiryDateTooltip: "The date on which this invitation expires",
        expiryDateRole: "Role expiry date",
        expiryDateRoleTooltip: "The end date of this role. After this date the role is removed from the user.",
        message: "Message",
        messagePlaceholder: "Message included in the invite",
        invite: "Send invite",
        enforceEmailEquality: "Enforce email equality",
        enforceEmailEqualityTooltip: "When checked the invitee must accept the invitation with the email where the invitation was send to",
        flash: {
            send: "Invitation was send",
            deleted: "Invitation has been deleted.",
            resend: "Invitation has been resend.",
            updated: "Invitation has been updated."
        },
        noEntities: "No outstanding invitations...",
        searchPlaceHolder: "Search invitations",
        invitations: "Invitations",
        existing: "Invitation",
        resend: "Resend",
        confirmation: {
            delete: "Are you sure you want to delete this invitation? This can not be undone.",
            resend: "Are you sure you want to resend this invitation?"
        }
    },
    profile: {
        header: "Hi {{name}}",
        title: "Profile",
        eppn: "Eppn",
        created: "Account created",
        institution: "Institution",
        institutions: "Institutions",
        endDate: "End date: ",
        noEndDate: "No end date",
        roles: "Roles",
        confirmation: {
            delete: "Are you sure you want to delete your account? This can not be undone and you'll have to be invited again to re-create an account.",
            deleteUserRole: "Are you sure you want to delete the role {{userRole}} from your account? This can not be undone.",
            deleteInstitutionMembership: "Are you sure you want to remove your membership from the institution {{institution}}? This can not be undone.",
            afterDelete: "You can close this tab now."
        }
    },
    aup: {
        hi: "Hi {{name}},",
        info: "We are ready to create your profile.",
        name: "Display name.",
        role: "You have been invited to accept the following {{cardinality}}: {{roles}} at the institution {{name}}",
        noRoles: "You have been invited to become a member at the institution {{name}}",
        singleRole: "role",
        multipleRoles: "roles",
        email: "Email address",
        title: "Acceptable use policy",
        disclaimer: "By logging on the Invite app, you become a user and agree to the <a href=\"{{url}}\" target=\"_blank\">term and conditions of our AUP.</a>",
        disclaimerChanged: "Institution {{name}} has updated the <a href=\"{{url}}\" target=\"_blank\">terms and conditions of their AUP.</a>",
        agreeWithTerms: "I hereby certify that I have read the AUP and that I accept them",
        onward: "Proceed",
        agreedFlash: "Your agreement with {{name}} has been saved.",
        emailEqualityConflict: "This invitation requires you to authenticate with the same email where the invitation was send to. Please close your browser and use the invitation link to login with that email.",
        unspecifiedIdConflict: "The information we received from the institution where you have authenticated contains an unique ID that is already used by a different user. Please contact <a href=\"mailto:contact@eduid.nl\">contact@eduid.nl</a> for help."
    },
    user: {
        confirmation: {
            delete: "Are you sure you want to delete {{name}}? This can not be undone and {{name}} has to be invited again to re-create an account.",
            deleteUserRole: "Are you sure you want to delete the role {{userRole}} of {{name}}? This can not be undone.",
            deleteInstitutionMembership: "Are you sure you want to remove {{name}} from the institution {{institution}}? This can not be undone."
        },
        flash: {
            deleted: "User {{name}} has been deleted.",
            deleteUserRole: "Role {{name}} has been deleted.",
            deleteInstitutionMembership: "Institution membership has been deleted."
        }
    },
    footer: {
        tips: "Need tips or info?",
        help: "Help & FAQ",
        product: "eduID invitation is a service by",
        productLink: "https://eduid.nl",
        surf: "SURF",
        surfLink: "https://surf.nl"
    },
    landing: {
        title: "Welcome to eduID invitation",
        info: "You don't have any roles or invitations.",
        disclaimer: "The eduID invitation portal is by invite only. If you want to enter, but don't have access, please contact your institution admin."
    }

};

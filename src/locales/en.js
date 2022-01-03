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
            users: "Users"
        }
    },
    breadcrumbs: {
        home: "Home"
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
    },
    users: {
        title: "Users",
        name: "Name",
        object: "User",
        email: "Email",
        roles: "Roles",
        authority: "Authority",
        authorities: {
            SUPER_ADMIN: "Super admin",
            INSTITUTION_ADMINISTRATOR: "Institution admin",
            INVITER: "Inviter",
            GUEST: "Guest"
        },
        searchPlaceHolder: "Search users",
        new: "Invite people",
        noEntities: "There are no users...",
        status: "Status",
        statuses: {
            open: "Open invitation",
            expired: "Expired invitation"
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
        entityIdPlaceholder: "Entity ID of the application",
        provisioning: "Provisioning",
        noProvisioning: "None",
        landingPage: "Landing page URL",
        landingPagePlaceholder: "Landing page of the application",
        provisioningHookUrl: "Provisioning hook URL",
        provisioningHookUrlPlaceholder: "Provisioning hook URL of the application",
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
        new: "New role",
        searchPlaceHolder: "Search roles",
        noEntities: "No roles found...",
        alreadyExists: "A Role with name {{value}} already exists for application {{application}}.",
        object: "Role",
        application: "Application",
        authority: "Authority",
        authorityTooltip: "The authority determines which users can invite people for this role",
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
            deleted: "Deleted {{object}} {{name}}",
        },
        nameTooltip: "The name of the {{object}} is part of the group membership URN that is send to services. Therefore it may not contain spaces or other non-asci characters."
    },
    invitations: {
        new: "New invite",
        invitees: "Invitees",
        inviteesPlaceholder: "Invitee email addresses",
        inviteesTooltip: "Add email addresses separated by comma, space or semi-colon or one-by-one using the enter key. You can also copy & paste a csv file with line-separated email addresses.",
        requiredEmail: "At least one email is required",
        requiredRole: "At least one role is required",
        intendedAuthority: "Authority",
        intendedAuthorityTooltip: "The authority determines the rights the invitee will be granted after accepting the invitation",
        roles: "Roles",
        rolesTooltip: "All the roles that the invitee will be granted after accepting the invitation",
        rolesPlaceHolder: "Choose one or more roles",
        expiryDate: "Expiry date invitation",
        expiryDateTooltip: "The date on which this invitation expires",
        expiryDateRole: "Expiry date role",
        expiryDateRoleTooltip: "The end date of this role. After this date the role is removed from the user.",
        message: "Message",
        messagePlaceholder: "Message included in the invite",
        invite: "Invite",
        enforceEmailEquality: "Enforce email equality",
        enforceEmailEqualityTooltip: "When checked the invitee must accept the invitation with the email where the invitation was send to",
        flash: {
            send: "Invitation was send"
        }
    },
    profile: {
        header: "Hi {{name}}",
        title: "Profile",
        eppn: "Eppn",
        created: "Account created",
        institution: "Institution",
        endDate: "End date",
        roles: "Roles",
        confirmation: {
            delete: "Are you sure you want to delete your account? This can not be undone and you'll have to be invited again to re-create an account.",
            afterDelete: "You can close this tab as there is nothing here anymore for you."
        }
    },
    aup: {
        hi: "Hi {{name}},",
        info: "We are ready to create your profile.",
        name: "Display name.",
        email: "Email address",
        title: "Acceptable use policy",
        disclaimer: "By logging on the Invite app, you become a user and agree to the <a href=\"{{url}}\" target=\"_blank\">term and conditions of our AUP.</a>",
        agreeWithTerms: "I hereby certify that I have read the AUP and that I accept them",
        onward: "Proceed",
        agreedFlash: "Your agreement with {{name}} has been saved.",
    },
    user: {
        confirmation: {
            delete: "Are you sure you want to {{name}}? This can not be undone and {{name}} has to be invited again to re-create an account.",
        },
        flash: {
            deleted: "User {{name}} has been deleted."
        }
    }
}
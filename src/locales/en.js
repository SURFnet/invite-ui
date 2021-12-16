import I18n from "i18n-js";

I18n.translations.en = {
    header: {
        title: "Invites"
    },
    home: {
        tabs: {
            institutions: "Institutions",
            applications: "Applications",
            roles: "Roles",
            profile: "Profile"
        }
    },
    institutions: {
        title: "Institutions",
        displayName: "Name",
        object: "Institution",
        entityId: "Entity ID",
        entityIdPlaceholder: "Entity ID of the institution",
        homeInstitution: "Schac home",
        homeInstitutionPlaceholder: "Schac home of the institution",
        aupUrl: "AUP Url",
        aupUrlPlaceholder: "AUP Url of the institution",
        searchPlaceHolder: "Search institutions",
        new: "New institution",
        noEntities: "There are no institutions...",
        newTitle: "New institution",
        editTitle: "Edit {{name}}",
        namePlaceholder: "Name of the institution"
    },
    applications: {
        title: "Applications",
        displayName: "Name",
        namePlaceholder: "Name of the application",
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
        newTitle: "New application",
        editTitle: "Edit {{name}}",
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
        required: "{{attribute}} is a required attribute",
        alreadyExists: "An {{object}} with {{attribute}} {{value}} already exists.",
        invalid: "{{value}} for {{attribute}} is invalid.",
        flash: {
            created: "Created {{object}} {{name}}",
            updated: "Updated {{object}} {{name}}",
            deleted: "Deleted {{object}} {{name}}",
        }
    }


}
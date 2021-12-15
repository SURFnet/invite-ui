import I18n from "i18n-js";

I18n.translations.en = {
    header: {
        title: "Invites"
    },
    home: {
        tabs: {
            institutions: "Institutions",
            applications: "Application",
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
    confirmationDialog: {
        confirm: "Please confirm",
        title: "Confirm",
        questions: {
            delete: "Are you sure you want to delete {{object}} {{name}}?"
        }
    },
    forms: {
        cancel: "Cancel",
        delete: "Delete",
        submit: "Submit",
        save: "Save",
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
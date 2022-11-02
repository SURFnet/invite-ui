import I18n from "i18n-js";

I18n.translations.nl = {

    header: {
        title: "Uitnodiging",
        afterLogout: "Sluit je browser om uit te loggen",
        confirmationHeader: "Sluit de browser"
    },
    home: {
        tabs: {
            institutions: "Instelling",
            applications: "Toepassing",
            roles: "Rollen",
            profile: "Profiel",
            users: "Gebruikers",
            invitations: "Uitnodigingen",
            scimFailures: "SCIM"
        }
    },
    breadcrumbs: {
        home: "Start",
        mineApplications: "Mijn applicaties"
    },
    institutions: {
        title: "Instellingen",
        name: "Naam",
        namePlaceholder: "Unieke naam voor de Instelling,m bijvoorbeeld Universiteit van Harderwijk",
        displayName: "Beschrijving",
        object: "Instelling",
        entityId: "Entity ID",
        entityIdPlaceholder: "Unieke entityID, Bijv. https://uvh.nl",
        homeInstitution: "Schac home",
        homeInstitutionPlaceholder: "Unieke primaire domeinnaam bijv. uvh.nl",
        aupUrl: "AUP Url",
        aupUrlPlaceholder: "Locatie voor de GebruikersOvereenkomst https://uvh.nl/aup",
        searchPlaceHolder: "Zoek instellingen",
        new: "Nieuwe instelling",
        noEntities: "Geen instellingen gevonden...",
        applications: "Applicaties",
        noApplications: "Geen applicaties",
        newRole: "Nieuw - ",
        endDate: "Ends on ",
        aup: {
            increment: "Nieuwe AUP",
            confirmation: "Weet je zeker dat je het versienummer van de overeenkomst wilt ophogen. Alle gebruikers moeten opnieuw de AUP bevestigen bij het inloggen.",
            flash: "AUP versie opgehoogd"
        },
        disclaimer: "Je bent geen lid meer van een instelling. Neem contact op met je instellingsbeheerder als dit je verbaast."
    },
    users: {
        title: "Gebruikers",
        name: "Naam",
        object: "Gebruiker",
        email: "Email",
        roles: "Rollen",
        authority: "Autoriteit",
        inviter: "Uitnodiger",
        intendedAuthority: "Gewenste Autoriteit",
        expires: " - verloopt {{date}}",
        authorities: {
            SUPER_ADMIN: "Super beheerder",
            INSTITUTION_ADMINISTRATOR: "Instellingsbeheerder",
            INVITER: "Uitnodiger",
            GUEST: "Gast"
        },
        searchPlaceHolder: "Zoek gebruikers",
        new: "Nieuwe uitnodiging",
        noEntities: "There are no users...",
        status: "Status",
        statuses: {
            open: "Open - verloopt op {{date}}",
            expired: "Verlopen op {{date}}"
        }
    },
    applications: {
        title: "Toepassing",
        name: "Naam",
        namePlaceholder: "Naam voor de Toepassing",
        displayName: "Beschrijving",
        displayNamePlaceholder: "Beschrijving voor deze toepassing",
        object: "Toepassing",
        entityId: "Entity ID",
        entityIdPlaceholder: "Entity ID van de toepassing, zoals bekend in SURFconext",
        provisioning: "Provisioning",
        noProvisioning: "Geen",
        landingPage: "Landingspagina url",
        landingPagePlaceholder: "Startpagina voor de toepassing",
        landingPageTooltip: "De landingspagina wordt gebruikt als de link op de gebruikers profiel pagina. De variabele %%eppn%% wordt vervangen door de eppn van de gebruiker.",
        provisioningHookUrl: "Provisioning hook URL",
        updateRolePutMethod: "Gebruik SCIM PUT hook (default PATCH)",
        updateRolePutMethodTooltip: "If checked then a PUT call is made to the provisioning URL with all the users with this role, otherwise a PATCH is made with only the delta (e.g. the user-role which was added or deleted)",
        provisioningHookUrlPlaceholder: "SCIM endpoint voor deze toepassing, e.g. https://university.nl/scim/v1",
        provisioningHookUsername: "Provisioning hook inlognaam",
        provisioningHookUsernamePlaceholder: "Provisioning hook inlognaam voor de toepassing",
        provisioningHookPassword: "Provisioning hook wachtwoord",
        provisioningHookPasswordPlaceholder: "Provisioning hook wachtwoord voor de toepassing",
        provisioningHookEmail: "Provisioning hook email",
        provisioningHookEmailPlaceholder: "Email adres voor provisioning",
        searchPlaceHolder: "Zoek toepassingen",
        new: "Nieuwe toepassing",
        noEntities: "Geen toepassingen gevonden...",
        conflictProvisioning: "Je kun niet zowel een provisioningHookUrl als een provisioningHookEmail gebruiken"
    },
    roles: {
        name: "Naam",
        namePlaceholder: "Naam van de rol",
        displayName: "Beschrijving",
        displayNamePlaceholder: "Beschrijving voor de rol",
        applicationName: "Toepassing",
        urn: "URN",
        new: "Nieuwe rol",
        searchPlaceHolder: "Zoek rollen",
        noEntities: "Geen rollen gevondens...",
        alreadyExists: "Een rol met de naam {{value}} bestaat al voor de toepassing {{application}}.",
        object: "Rol",
        application: "Toepassing",
        authority: "Autoriteit",
        authorityTooltip: "Welk nivo gebruikers kan uitnodigen voor deze rol",
        defaultExpiryDays: "Default verloop dagen",
        defaultExpiryDaysPlaceholder: "bijv. 14 dagen",
        defaultExpiryDaysTooltip: "Een standaard geldigheidsduur van de rol (in dagen) bepaalt de einddatum van de uitnodiging voor deze rol, deze kan worden bewerkt bij het verzenden van de uitnodiging",
    },
    scimFailures: {
        title: "Alle SCIM fouten",
        message: "Bericht",
        httpMethod: "HTTP",
        api: {
            name: "API",
            users: "Gebruikers",
            groups: "Groepen"
        },
        createdAt: "Datum",
        application: "Applicatie",
        uri: "URI",
        searchPlaceHolder: "Zoek fouten",
        serviceProviderId: "Externe referentie ID",
        noEntities: "Er zijn gelukkig geen SCIM fouten...",
        details: "SCIM fout details",
        path: "SCIM fouten",
        failure: "Fout",
        flash: {
            deleted: "SCIM fout is verwijderd.",
            resend: "SCIM fout is opnieuw aangeboden."
        },
        confirmation: {
            delete: "Weet je zeker dat je deze SCIM fout wil verwijdern? Dit is definitief.",
            resend: "Weet je zeker dat je deze SCIM fout opnieuw wilt aanbieden?"
        },
        error: "Het verwerken van de SCIM fout ging fout en de SCIM fout is niet verwijderd. Root cause: {{msg}}"
    },
    confirmationDialog: {
        title: "Graag bevestigen",
        confirm: "Bevestig",
        cancel: "Annuleer",
        questions: {
            delete: "Weet je zeker dat je {{object}} {{name}} wil verwijderen?"
        }
    },
    forms: {
        cancel: "Annuleer",
        delete: "Verwijder",
        submit: "Verstuur",
        save: "Opslaan",
        update: "Bijwerken",
        edit: "Bewerk",
        createdAt: "Aangemaakt",
        new: "Nieuwe {{object}}",
        editObject: "Bewerk {{name}}",
        required: "{{attribute}} moet worden ingevuld",
        alreadyExists: "Een {{object}} met {{attribute}} {{value}} bestaat al.",
        invalid: "{{value}} is niet geldig voor {{attribute}}.",
        flash: {
            created: "{{object}} {{name}} aangemaakt",
            updated: "{{object}} {{name}} bijgewerkt",
            deleted: "{{object}} {{name}} verwijderd"
        },
        nameTooltip: "De naam van de {{object}} wordt gebruikt in de groepslidmaatschap URN die wordt verzonden aan de toepassingen. Het mag daarom geen spaties of vreemde tekens bevatten.",
        provisioningHookUrlTooltip: "De provisioning URL inclusief het pad. E.g. https://university.nl/scim/v1"
    },
    invitations: {
        new: "Nieuwe uitnodiging",
        invitees: "Genodigden",
        inviteesPlaceholder: "Email adressen om uit te nodigen",
        inviteesTooltip: "Voeg email adressen toe, gescheiden door een komma, spatie, puntkomma of een voor een met een enter. Je kunt ook een csv bestand kopieren en plakken.",
        requiredEmail: "Gebruik minimaal één email adres",
        requiredRole: "Gebruik minimaal één rol voor een.gast uitnodiging",
        intendedAuthority: "Autoriteit",
        intendedAuthorityTooltip: "De autoriteit bepaalt welke rechten de gebruiker krijgt voor deze rol na het accepteren van de uitnodiging.",
        roles: "Rollen",
        rolesTooltip: "Alle rollen die de gebruiker krijgt na het accepteren van de uitnodiging.",
        rolesPlaceHolder: "Kies één of meer rollen",
        expiryDate: "Verloopdatum voor de uitnodiging",
        expiryDateTooltip: "Einddatum voor het accepteren van de uitnodiging",
        expiryDateRole: "Einddatum rol",
        expiryDateRoleTooltip: "De einddatum voor deze rol.Na deze datum wordt de rol verwijderd van de gebruiker.",
        message: "Bericht",
        messagePlaceholder: "Een bericht om toe te voegen aan de uitnodiging",
        invite: "Stuur Uitnodiging",
        enforceEmailEquality: "Vereis hetzelfde emailadres",
        enforceEmailEqualityTooltip: "Als deze optie aan staat, moet de gebruiker inloggen met een email-adres wat gelijk is aan het adres waaraan de uitnodiging is verstuurd.",
        flash: {
            send: "De uitnodiging is verzonden",
            deleted: "De uitnodiging is verwijderd.",
            resend: "De uitnodiging is opnieuw verzonden.",
            updated: "De uitnodiging is bijgewerkt."
        },
        noEntities: "Geen open Uitnodigingen...",
        searchPlaceHolder: "Zoek uitnodigingen",
        invitations: "Uitnodigingen",
        existing: "uitnodiging",
        resend: "Opniew versturen",
        confirmation: {
            delete: "Weet je zeker dat je deze uitnodiging wil verwijdern? Dit is definitief.",
            resend: "Weet je zeker dat je de uitnodiging opnieuw wilt versturen?"
        }
    },
    profile: {
        header: "Hallo {{name}}",
        title: "Profiel",
        eppn: "Eppn",
        created: "Account aangemaakt",
        institution: "Instelling",
        institutions: "Instellingen",
        endDate: "Einddatum: ",
        inviter: "Uitgenodigd door: ",
        noInviter: "Onbekend",
        noEndDate: "Geen einddatum",
        roles: "Rollen",
        confirmation: {
            delete: "Weet je zeker dat je jouw account wil verwijderen? Dit kan niet ondegaan gemaakt worden, en je moet opnieuw worden uitgenodigd om een nieuw account aan te maken.",
            deleteUserRole: "Weet je zeker dat je de rol {{userRole}} van je account wilt verwijderen? Dit kan niet ongedaan gemaakt worden.",
            deleteInstitutionMembership: "Weet je zeker dat je je lidmaatschap van instelling {{institution}} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.",
            afterDelete: "Je kunt dit tabblad nu sluiten."
        }
    },
    aup: {
        hi: "Hallo {{name}},",
        info: "We gaan jouw profiel aanmaken.",
        name: "Weergave naam.",
        invitation: "Je bent uitgenodigd om een <strong>{{authority}}</strong> te worden bij de instelling {{name}}.",
        inviter: "Je krijgt het recht om mensen uit te nodigen voor de volgende {{cardinality}}: {{roles}}.",
        guest: "Je krijgt de volgende {{cardinality}} toebedeeld: {{roles}}.",
        roles: {
            inviter: "uitnodiger",
            guest: "gast",
            super_admin: "super beheerder",
            institution_administrator: "instellingsbeheerder"
        },
        noRoles: "Je bent uitgenodigd om een <strong>{{authority}}</strong> te worden bij de instelling {{name}}",
        singleRole: "rol",
        multipleRoles: "rollen",
        email: "Email adres",
        alreadyAccepted: "Deze uitnodiging is al geaccepteerd. Neem contact op met {{inviter}} als je denkt dat dit een fout is.",
        title: "Gebruiksvoorwaarden",
        disclaimer: "Door in te loggen bij deze applicatie wordt er een account aangemaakt, en ga je akkoord met <a href=\"{{url}}\" target=\"_blank\"> onze gebruikersvoorwaarden.</a>",
        disclaimerChanged: "Instelling {{name}} heeft de <a href=\"{{url}}\" target=\"_blank\">gebruikersvoorwaarden</a> vernieuwd.",
        agreeWithTerms: "Ik bevestig dat ik de gebruiksvoorwaarden heb gelezen en akkoord ga hiermee.",
        onward: "Doorgaan",
        agreedFlash: "Jouw overeenkomst met {{name}} is opgeslagen.",
        emailEqualityConflict: "Deze uitnodiging vereist dat je inlogt met hetzelfde emaiadres als waar de uitnodiging aan verstuurd is. Sluit alle browservensters en open de uitnodigings-link opnieuw om met het juiste account in te loggen.",
        unspecifiedIdConflict: "De informatie die we hebben ontvangen van de instelling waar je je hebt geauthenticeerd, bevat een unieke ID die al door een andere gebruiker wordt gebruikt. Neem voor hulp contact op met <a href=\"mailto:contact@eduid.nl\">contact@eduid.nl</a>."
    },
    user: {
        confirmation: {
            delete: "Weet je zeker dat je {{name}} wil verwijderen? Dit kan niet ongedaan gemaakt worden, en {{name}} moet opnieuw worden uitgenodig.",
            deleteUserRole: "Weet je zeker dat je de rol {{userRole}} van {{name}} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.",
            deleteInstitutionMembership: "Weet je zeker dat je {{name}} van instelling {{institution}} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.",
        },
        flash: {
            deleted: "Gebruiker {{name}} is verwijderd.",
            deleteUserRole: "Rol {{userRole}} is verwijderd.",
            deleteInstitutionMembership: "Lidmaatschap instelling is verwijderd"
        }
    },
    footer: {
        tips: "Tips of help nodig?",
        help: "Help & FAQ",
        product: "eduID invitation is een dienst van",
        productLink: "https://eduid.nl",
        surf: "SURF",
        surfLink: "https://surf.nl"
    },
    landing: {
        title: "Welkom op eduID invitation",
        info: "Je hebt geen enkele rol of uitnodiging.",
        disclaimer: "De eduID invitation portaal is alleen beschikbaar op uitnodiging. Als je binnen wilt komen, maar nog geen toegang hebt, neem dan contact op met je beheerder bij jouw instelling."
    }

};

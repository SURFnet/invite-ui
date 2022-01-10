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
            invitations: "Uitnodigingen"
        }
    },
    breadcrumbs: {
        home: "Start"
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
        aup: {
            increment: "Nieuwe AUP",
            confirmation: "Weet je zeker dat je het versienummer van de overeenkomst wilt ophogen. Alle gebruikers moeten opnieuw de AUP bevestigen bij het inloggen.",
            flash: "AUP versie opgehoogd"
        }
    },
    users: {
        title: "Gebruikers",
        name: "Naam",
        object: "Gebruiker",
        email: "Email",
        roles: "Rollen",
        authority: "Autoriteit",
        intendedAuthority: "Gewenste Autoriteit",
        authorities: {
            SUPER_ADMIN: "Super beheerder",
            INSTITUTION_ADMINISTRATOR: "Instellingsbeheerder",
            INVITER: "Uitnodiger",
            GUEST: "Gast"
        },
        searchPlaceHolder: "Zoek gebruikers",
        new: "Uitnodigen",
        noEntities: "There are no users...",
        status: "Status",
        statuses: {
            open: "Open uitnodiging",
            expired: "Verlopen uitnodiging"
        }
    },
    applications: {
        title: "Toepassing",
        name: "Naam",
        namePlaceholder: "Naaan voor de Toepassing",
        displayName: "Beschrijving",
        displayNamePlaceholder: "Beschrijving voor deze toepassing",
        object: "Toepassing",
        entityId: "Entity ID",
        entityIdPlaceholder: "Entity ID van de toepassing, zoals bekend in SURFconext",
        provisioning: "Provisioning",
        noProvisioning: "Geen",
        landingPage: "Landingspagina url",
        landingPagePlaceholder: "Startpagina voor de toepassing",
        provisioningHookUrl: "Provisioning hook URL",
        provisioningHookUrlPlaceholder: "SCIM endpoint voor deze toepassing.",
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
        new: "Nieuwe rol",
        searchPlaceHolder: "Zoek rollen",
        noEntities: "Geen rollen gevondens...",
        alreadyExists: "Een rol met de naam {{value}} bestaat al voor de toepassing {{application}}.",
        object: "Rol",
        application: "Toepassing",
        authority: "Autoriteit",
        authorityTooltip: "Welk nivo gebruikers kan uitnodigen voor deze rol"
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
        nameTooltip: "De naam van de {{object}} wordt gebruikt in de groepslidmaatschap URN die wordt verzonden aan de toepassingen. Het mag daarom geen spaties of vreemde tekens bevatten."
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
        invite: "Uitnodiging",
        enforceEmailEquality: "Vereis hetzelfde emailadres",
        enforceEmailEqualityTooltip: "Als deze optie aan staat, moet de gebruiker inloggen met een email-adres wat gelijk is aan het adres waaraan de uitnodiging is verstuurd.",
        flash: {
            send: "De uitnodiging is verzonden",
            deleted: "De uitnodiging is verwijderd.",
            resend: "De uitnodiging is opnieuw verzonden."
        },
        noEntities: "Geen open Uitnodigingen...",
        searchPlaceHolder: "Zoek uitnodigingen",
        invitations: "Uitnodigingen",
        existing: "uitnodiging",
        resend: "Opniew versturen",
        confirmation: {
            delete: "Weet je zeker dat je deze uitnodiging wil verwijdern? Dit is definitief.",
            resend: "Weet je zeker dat je de uitnodiging wil verwijderen?"
        }
    },
    profile: {
        header: "Hallo {{name}}",
        title: "Profiel",
        eppn: "Eppn",
        created: "Account aangemaakt",
        institution: "Instelling",
        institutions: "Instellingen",
        endDate: "einddatum",
        roles: "Rollen",
        confirmation: {
            delete: "Weet je zeker dat je jouw account wil verwijderen? Dit kan niet ondegaan gemaakt worden, en je moet opnieuw worden uitgenodigd om een nieuw account aan te maken.",
            afterDelete: "Je kunt dit tabblad nu sluiten."
        }
    },
    aup: {
        hi: "Hallo {{name}},",
        info: "We gaan jouw profiel aanmaken.",
        name: "Weergave naam.",
        role: "Je bent gevraagd om de uitnod te accepteren voor {{cardinality}}: {{roles}} bij de instelling {{name}}",
        noRoles: "Je bent gevreegd deel te namen aan {{name}}",
        singleRole: "rol",
        multipleRoles: "rollen",
        email: "Email adres",
        title: "Gebruiksvoorwaarden",
        disclaimer: "Door in te loggen bij deze applicatie wordt er een account aangemaakt, en ga je akkoord met <a href=\"{{url}}\" target=\"_blank\"> onze gebruikersvoorwaarden.</a>",
        disclaimerChanged: "Instelling {{name}} heeft de <a href=\"{{url}}\" target=\"_blank\">gebruikersvoorwaarden</a> vernieuwd.",
        agreeWithTerms: "Ik bevestig dat ik de gebruiksvoorwaarden heb gelezen en akkoord ga hiermee.",
        onward: "Doorgaan",
        agreedFlash: "Jouw overeenkomst met {{name}} is opgeslagen.",
        emailEqualityConflict: "Deze uitnodiging vereist dat je inlogt met hetzelfde emaiadres als waar de uitnodiging aan verstuurd is. Sluit alle browservensters en open de uitnodigings-link opnieuw om met het juiste account in te loggen."
    },
    user: {
        confirmation: {
            delete: "Weet je zeker dat je {{name}} wil verwijseren? Dit kan niet ongedaan gemaakt worden, en {{name}} moet opnieuw worden uitgenodig."
        },
        flash: {
            deleted: "Gebruiker {{name}} is verwijderd."
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
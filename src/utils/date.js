import I18n from "i18n-js";

export const futureDate = daysAhead => {
    const today = new Date();
    const time = today.getTime() + (1000 * 60 * 60 * 24 * daysAhead);
    return new Date(time);
}

export const formatDate = epoch => {
    const date = new Date(epoch * 1000);
    const options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
    return date.toLocaleDateString(I18n.locale === "en" ? "en-EN" : "nl-NL", options);
}

export const formatDateShort = epoch => {
    const date = new Date(epoch * 1000);
    return date.toLocaleDateString(I18n.locale === "en" ? "en-EN" : "nl-NL");
}

export const formatDateLong = epoch => {
    const date = new Date(epoch * 1000);
    const options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"};
    return date.toLocaleDateString(I18n.locale === "en" ? "en-EN" : "nl-NL", options);
}

export const isExpired = epoch => {
    const now = new Date().getTime() / 1000;
    return now > epoch;
}

export const invitationRoleExpiryDate = invitation => {
    const roleWithEndDate = invitation.roles.find(role => role.endDate);
    return roleWithEndDate ? new Date(roleWithEndDate.endDate * 1000) : null;
}
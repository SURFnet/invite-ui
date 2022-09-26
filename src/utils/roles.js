export const urnFromRole = (application, role) => {
    const groupUrnPrefix = window.config.groupUrnPrefix;
    const homeInstitution = application.institution.homeInstitution.toLowerCase();
    const applicationName = application.name.toLowerCase();
    const roleName = role.name.toLowerCase();
    return `${groupUrnPrefix}:${homeInstitution}:${applicationName}:${roleName}`
}

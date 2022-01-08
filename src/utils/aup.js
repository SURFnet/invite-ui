import {isEmpty} from "./forms";

export const institutionMembershipsWithNoAup = user =>
    user.institutionMemberships.filter(membership => {
        const institution = membership.institution;
        return !isEmpty(institution.aupUrl) && !user.aups.some(aup => aup.institutionId === institution.id && aup.version === institution.aupVersion);
    })
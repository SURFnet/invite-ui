import {institutionMembershipsWithNoAup} from "../../utils/aup";

const userTemplate = {
    aups: [{
        institutionId: 1,
        version: "1"
    }
    ],
    institutionMemberships: [
        {
            institution: {id: 1, aupUrl: "https://aup", aupVersion: "1"}
        }
    ]
}

test("user needs aup confirmation", () => {
    const user = {...userTemplate, aups: []};
    const membershipsWithoutAup = institutionMembershipsWithNoAup(user);
    expect(membershipsWithoutAup.length).toBe(1);
});

test("user needs aup confirmation because version diff", () => {
    const user = {
        ...userTemplate, institutionMemberships: [
            {
                institution: {id: 1, aupUrl: "https://aup", aupVersion: "2"}
            }
        ]
    };
    const membershipsWithoutAup = institutionMembershipsWithNoAup(user);
    expect(membershipsWithoutAup.length).toBe(1);
});

test("user needs no aup", () => {
    const user = {...userTemplate};
    const membershipsWithoutAup = institutionMembershipsWithNoAup(user);
    expect(membershipsWithoutAup.length).toBe(0);
});

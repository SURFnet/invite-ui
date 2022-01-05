import {AUTHORITIES, isAllowed} from "../../utils/authority";

test("is allowed", () => {
  const user = {
    institutionMemberships: [
      {
        authority: AUTHORITIES.SUPER_ADMIN.name,
        institution: {id: 1}
      }
    ]
  };
  const val = isAllowed(AUTHORITIES.SUPER_ADMIN, user, 1);
  expect(val).toBe(true);
});

test("is not allowed", () => {
  const user = {
    institutionMemberships: [
      {
        authority: AUTHORITIES.INVITER.name,
        institution: {id: 1}
      }
    ]
  };
  const val = isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user, 1);
  expect(val).toBe(false);
});

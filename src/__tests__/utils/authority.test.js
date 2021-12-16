import {AUTHORITIES, isAllowed} from "../../utils/authority";

test("is allowed", () => {
  const val = isAllowed(AUTHORITIES.SUPER_ADMIN, {authority: AUTHORITIES.SUPER_ADMIN.name})
  expect(val).toBe(true);
});

test("is not allowed", () => {
  const val = isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, {authority: AUTHORITIES.INVITER.name})
  expect(val).toBe(false);
});

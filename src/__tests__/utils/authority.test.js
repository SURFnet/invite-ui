import {AUTHORITIES, isAllowed} from "../../utils/authority";

test("isAllowed", () => {
  const val = isAllowed(AUTHORITIES.SUPER_ADMIN, {authority: AUTHORITIES.SUPER_ADMIN.name})
  expect(val).toBe(true);
});

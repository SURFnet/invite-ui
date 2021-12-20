import {nameUrnCompatibilityCheck} from "../../utils/forms";

test("urn compatibility allowed", () => {
  const s = nameUrnCompatibilityCheck(" Ä ë %$#@!- ok.Bę ");
  expect(s).toBe("A_e__ok.Be");
});

test("urn compatibility empty", () => {
  const s = nameUrnCompatibilityCheck("  ");
  expect(s).toBe("");
});

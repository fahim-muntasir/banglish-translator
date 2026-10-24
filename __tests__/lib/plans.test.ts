import { isUserPlan } from "@/lib/plans";

describe("isUserPlan", () => {
  it("accepts supported plan names only", () => {
    expect(isUserPlan("FREE")).toBe(true);
    expect(isUserPlan("STARTER")).toBe(true);
    expect(isUserPlan("PRO")).toBe(true);
    expect(isUserPlan("BUSINESS")).toBe(true);
    expect(isUserPlan("pro")).toBe(false);
    expect(isUserPlan(null)).toBe(false);
    expect(isUserPlan({})).toBe(false);
  });
});

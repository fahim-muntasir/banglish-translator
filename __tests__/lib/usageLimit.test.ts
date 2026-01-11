import { canUserConvert, increaseUsage } from "@/lib/usageLimit";

describe("usageLimit", () => {
  it("allows conversion initially", () => {
    expect(canUserConvert()).toBe(true);
  });

  it("blocks after limit", () => {
    for (let i = 0; i < 5; i++) {
      increaseUsage();
    }

    expect(canUserConvert()).toBe(false);
  });
});

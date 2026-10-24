import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  it("toggles theme on click", async () => {
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", { name: /Switch to dark mode/i });

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(button);
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    );
  });
});

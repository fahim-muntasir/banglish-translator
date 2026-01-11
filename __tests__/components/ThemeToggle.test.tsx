import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  it("toggles theme on click", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /Switch to dark mode/i });

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});


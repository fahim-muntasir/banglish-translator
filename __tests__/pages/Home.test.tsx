import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        convertedText: "aj akash khub sundor",
      }),
  })
) as jest.Mock;

jest.mock("@/lib/usageLimit", () => ({
  canUserConvert: () => true,
  increaseUsage: jest.fn(),
}));

jest.mock("@/lib/alert", () => ({
  showLimitError: jest.fn(),
  showError: jest.fn(),
}));

jest.mock("@/components/FloatingShapes", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/ThemeToggle", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/FlagButton", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div>Footer</div>,
}));
jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <h1>Banglish Converter</h1>,
}));

describe("Home Page", () => {
  it("renders the page correctly", () => {
    render(<Home />);

    expect(screen.getByText("Banglish Converter")).toBeInTheDocument();
  });

  it("allows typing in the input", () => {
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      /type or paste text/i
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: { value: "আজ আকাশ খুব সুন্দর" },
    });

    expect(textarea.value).toBe("আজ আকাশ খুব সুন্দর");
  });

  it("disables convert button when input is empty", () => {
    render(<Home />);

    const button = screen.getByRole("button", { name: /convert/i });
    expect(button).toBeDisabled();
  });

  it("calls API and shows output after conversion", async () => {
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      /type or paste text/i
    );

    fireEvent.change(textarea, {
      target: { value: "আজ আকাশ খুব সুন্দর" },
    });

    const button = screen.getByRole("button", { name: /convert/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("aj akash khub sundor")
      ).toBeInTheDocument();
    });
  });
});

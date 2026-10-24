import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

let mockUser: {
  uid: string;
  getIdToken: jest.Mock;
} | null = {
  uid: "test-user",
  getIdToken: jest.fn().mockResolvedValue("test-token"),
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        convertedText: "aj akash khub sundor",
      }),
  })
) as jest.Mock;

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock("@/lib/auth", () => ({
  signInWithGoogle: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("@/components/SigninButton", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/PricingModal", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/CreditsBar", () => ({
  __esModule: true,
  default: () => null,
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
  beforeEach(() => {
    mockUser = {
      uid: "test-user",
      getIdToken: jest.fn().mockResolvedValue("test-token"),
    };
  });

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

  it("resumes a pending conversion after sign-in", async () => {
    mockUser = null;
    const { rerender } = render(<Home />);

    fireEvent.change(screen.getByPlaceholderText(/type or paste text/i), {
      target: { value: "আজ আকাশ খুব সুন্দর" },
    });
    fireEvent.click(screen.getByRole("button", { name: /convert to banglish/i }));

    expect(document.querySelector('button[type="submit"]')).toBeEnabled();

    mockUser = {
      uid: "test-user",
      getIdToken: jest.fn().mockResolvedValue("test-token"),
    };
    rerender(<Home />);

    await waitFor(() => {
      expect(screen.getByText("aj akash khub sundor")).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/components/CreditsBar", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

import TextInput from "@/components/TextInput";

describe("TextInput", () => {
  it("renders textarea", () => {
    render(
      <TextInput
        value=""
        onChange={jest.fn()}
        onSubmit={jest.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = jest.fn();

    render(
      <TextInput
        value=""
        onChange={onChange}
        onSubmit={jest.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello" },
    });

    expect(onChange).toHaveBeenCalled();
  });
});

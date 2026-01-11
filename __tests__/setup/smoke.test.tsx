import { render, screen } from "@testing-library/react";

describe("Jest setup smoke test", () => {
  it("runs tests successfully", () => {
    render(<div>Hello Test</div>);

    expect(screen.getByText("Hello Test")).toBeInTheDocument();
  });
});

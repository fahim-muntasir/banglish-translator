import { render, screen, fireEvent } from "@testing-library/react";
import OutputCard from "@/components/OutputCard";

describe("OutputCard", () => {
  it("calls clear handler", () => {
    const onClear = jest.fn();
    render(<OutputCard output="Test" onClear={onClear} isTyping={false} />);

    const clearButton = screen.getByRole("button", { name: /Clear output/i });
    fireEvent.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });
});

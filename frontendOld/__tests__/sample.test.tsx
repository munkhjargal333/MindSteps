import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("renders simple text without a component", () => {
  render(<div>Hello MindSteps</div>);
  expect(screen.getByText("Hello MindSteps")).toBeInTheDocument();
});

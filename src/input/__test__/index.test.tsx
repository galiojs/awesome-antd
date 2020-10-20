import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import AweInput from "..";
import { async } from "q";

describe("Testing <AweInput />", () => {
  test("max character onChange", () => {
    render(<AweInput maxCharacter={100} />);
    expect(screen.queryByText("5/100")).toBeNull();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" }
    });
    expect(screen.queryByText("5/100")).toBeInTheDocument();
  });

  test("max character defaultValue and onChange", () => {
    render(<AweInput maxCharacter={100} defaultValue="我是默认的值！" />);
    expect(screen.queryByText("7/100")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" }
    });
    expect(screen.queryByText("5/100")).toBeInTheDocument();
  });
});

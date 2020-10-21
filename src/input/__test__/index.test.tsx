import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AweInput from "..";

describe("Testing <AweInput />", () => {
  test("maxLength showLengthCount onChange", () => {
    render(<AweInput maxLength={10} showLengthCount={true} />);
    expect(screen.queryByText("5/10")).toBeNull();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" }
    });
    expect(screen.queryByText("5/10")).toBeInTheDocument();
  });

  test("maxLength defaultValue showLengthCount ", () => {
    render(
      <AweInput
        maxLength={10}
        showLengthCount={true}
        defaultValue="我是默认的值！"
      />
    );
    expect(screen.queryByText("7/10")).toBeInTheDocument();
    userEvent.type(screen.getByRole("textbox"), "hellohello1");
    expect(screen.queryByText("10/10")).toBeInTheDocument();
  });

  test("maxLength showLengthCount defaultValue value", () => {
    render(
      <AweInput
        maxLength={5}
        showLengthCount={true}
        defaultValue="我是默认的值！"
        value="值"
      />
    );
    expect(screen.queryByText("1/5")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" }
    });
    expect(screen.queryByText("5/5")).toBeInTheDocument();
  });

  test("maxLength showLengthCount value suffix ", () => {
    render(
      <AweInput
        maxLength={5}
        showLengthCount={true}
        value="值"
        suffix="@163.com"
      />
    );
    expect(screen.queryByText("1/5 @163.com")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" }
    });
    expect(screen.queryByText("5/5 @163.com")).toBeInTheDocument();
  });

  test("showLengthCount value suffix ", () => {
    render(<AweInput showLengthCount={true} value="值" suffix="@163.com" />);
    expect(screen.queryByText("1 @163.com")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" }
    });
    expect(screen.queryByText("5 @163.com")).toBeInTheDocument();
  });
});

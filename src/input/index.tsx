import React from "react";
import Input, { InputProps } from "antd/lib/input";

export interface AweInputProps extends InputProps {
  maxLength: number;
  showLengthCount: boolean;
  suffix?: string | React.ReactNode;
}

export interface AweInputState {
  lengthCount: string;
}

export class AweInput extends React.PureComponent<
  AweInputProps,
  AweInputState
> {
  static defaultProps: Partial<AweInputProps> = {
    maxLength: 0,
    showLengthCount: false
  };

  state = {
    lengthCount: "0"
  };

  componentDidMount() {
    if (
      "defaultValue" in this.props &&
      !("value" in this.props) &&
      this.props.showLengthCount
    ) {
      this.setState({
        lengthCount: this._getLengthCount(this.props.defaultValue)
      });
    }
    if ("value" in this.props && this.props.showLengthCount) {
      this.setState({
        lengthCount: this._getLengthCount(this.props.value)
      });
    }
  }

  private _getLengthCount = (
    value?: string | ReadonlyArray<string> | number
  ) => {
    const { maxLength } = this.props;

    if (value === null || value === undefined) {
      return "0";
    }

    let text = value;
    if (Array.isArray(value)) {
      text = value.join();
    }
    if (typeof value == "number") {
      text = value.toString();
    }
    if (maxLength <= 0) {
      return (text as string).length.toString();
    }
    return `${(text as string).length}/${maxLength}`;
  };

  private _onChange = (e: any) => {
    const { onChange, showLengthCount } = this.props;
    if (showLengthCount) {
      this.setState({
        lengthCount: this._getLengthCount(e.target.value)
      });
    }
    if (typeof onChange !== "function") {
      return;
    }
    onChange(e);
  };

  render() {
    const {
      value,
      suffix,
      showLengthCount,
      maxLength,
      ...restProps
    } = this.props;
    const { lengthCount } = this.state;

    const extraProps: Partial<AweInputProps> = {};

    if ("value" in this.props) {
      extraProps.value = value;
    }

    return (
      <Input
        suffix={
          showLengthCount
            ? `${lengthCount} ${suffix !== undefined ? suffix : ""}`
            : suffix
        }
        onChange={this._onChange}
        maxLength={maxLength}
        {...restProps}
        {...extraProps}
      />
    );
  }
}

export default AweInput;

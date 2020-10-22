import React from "react";
import Input, { InputProps } from "antd/lib/input";

export interface AweInputProps extends InputProps {
  showLengthCount: boolean;
}

export interface AweInputState {
  lengthCount: string;
}

function getLengthCount(
  value?: string | ReadonlyArray<string> | number,
  maxLength?: number
) {
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
  if (maxLength === undefined) {
    return (text as string).length.toString();
  }
  return `${(text as string).length}/${maxLength}`;
}

export class AweInput extends React.PureComponent<
  AweInputProps,
  AweInputState
> {
  static defaultProps: Partial<AweInputProps> = {
    showLengthCount: false
  };

  state = {
    lengthCount: "0"
  };

  static getDerivedStateFromProps(props: AweInputProps) {
    if ("value" in props && props.showLengthCount) {
      return {
        lengthCount: getLengthCount(props.value, props.maxLength)
      };
    }
    return null;
  }

  componentDidMount() {
    if (
      "defaultValue" in this.props &&
      !("value" in this.props) &&
      this.props.showLengthCount
    ) {
      this.setState({
        lengthCount: getLengthCount(
          this.props.defaultValue,
          this.props.maxLength
        )
      });
    }
  }

  private _changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, showLengthCount, maxLength } = this.props;
    if (showLengthCount) {
      this.setState({
        lengthCount: getLengthCount(evt.target.value, maxLength)
      });
    }
    if (typeof onChange !== "function") {
      return;
    }
    onChange(evt);
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
        suffix={showLengthCount ? lengthCount : suffix}
        maxLength={maxLength}
        {...restProps}
        {...extraProps}
        onChange={this._changeHandler}
      />
    );
  }
}

export default AweInput;

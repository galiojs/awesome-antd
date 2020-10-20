import React from "react";
import Input, { InputProps } from "antd/lib/input";

export interface AweInputProps extends InputProps {
  maxCharacter: number;
}

export interface AweInputState {
  suffixText: string;
}

export class AweInput extends React.PureComponent<
  AweInputProps,
  AweInputState
> {
  static defaultProps: Partial<AweInputProps> = {
    maxCharacter: 0
  };

  state = {
    suffixText: ""
  };

  componentDidMount() {
    if ("defaultValue" in this.props) {
      this.setState({
        suffixText: this.getSuffixText(this.props.defaultValue)
      });
    }
  }

  private getSuffixText = (value: any) => {
    const { maxCharacter } = this.props;
    let text = "";
    if (maxCharacter > 0) {
      if (Array.isArray(value)) {
        text = value.join();
      }
      if (["string", "number"].includes(typeof value)) {
        text = value;
      }
      return `${text.length}/${maxCharacter}`;
    } else {
      return text;
    }
  };

  private onChange = (e: any) => {
    const { onChange } = this.props;
    this.setState({
      suffixText: this.getSuffixText(e.target.value)
    });
    if (typeof onChange !== "function") {
      return;
    } else {
      onChange(e);
    }
  };

  render() {
    const { maxCharacter, value, ...restProps } = this.props;
    const { suffixText } = this.state;
    const extraProps: Partial<AweInputProps> = {};
    if ("value" in this.props) {
      extraProps.value = value;
    }
    return (
      <Input
        suffix={suffixText}
        onChange={this.onChange}
        {...restProps}
        {...extraProps}
      />
    );
  }
}

export default AweInput;

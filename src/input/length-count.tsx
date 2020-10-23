import React from "react";

export interface LengthCountProps {
  showLengthCount: boolean;
  defaultValue?: string | number | readonly string[];
  value?: string | number | readonly string[];
  maxLength?: number;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  children: (props: {
    lengthCount: string;
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
  }) => JSX.Element;
}

export interface LengthCountState {
  lengthCount: string;
}

function getLengthCount(
  value?: string | ReadonlyArray<string> | number,
  maxLength?: number
) {
  if (value === null || value === undefined) {
    return maxLength !== undefined ? `0/${maxLength}` : "0";
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

export class LengthCount extends React.PureComponent<
  LengthCountProps,
  LengthCountState
> {
  static defaultProps: Partial<LengthCountProps> = {
    showLengthCount: false
  };

  state = {
    lengthCount: "0"
  };

  static getDerivedStateFromProps(props: LengthCountProps) {
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

  private _changeHandler = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    const { children } = this.props;
    const { lengthCount } = this.state;

    return children({ lengthCount, onChange: this._changeHandler });
  }
}

export default LengthCount;

import React from "react";
import Input, { TextAreaProps } from "antd/lib/input";
import Icon from "antd/lib/icon";

import LengthCount from "./length-count";

export interface AweTextAreaProps extends TextAreaProps {
  showLengthCount?: boolean;
}

export interface TextAreaState {
  lengthCount: string;
}

export class TextArea extends React.PureComponent<
  AweTextAreaProps,
  TextAreaState
> {
  static defaultProps: Partial<AweTextAreaProps> = {
    showLengthCount: false
  };

  render() {
    const {
      value,
      allowClear,
      showLengthCount,
      maxLength,
      className,
      defaultValue,
      ...restProps
    } = this.props;
    const extraProps: AweTextAreaProps = {};
    if ("value" in this.props) {
      extraProps.value = value;
    }
    if ("defaultValue" in this.props) {
      extraProps.defaultValue = defaultValue;
    }
    return (
      <LengthCount
        {...extraProps}
        maxLength={maxLength}
        showLengthCount={showLengthCount}
      >
        {({ lengthCount, onChange }) => {
          if (allowClear) {
            return (
              <>
                <span
                  className={`ant-input-affix-wrapper ant-input-affix-wrapper-textarea-with-clear-btn ${className ||
                    ""}`}
                >
                  <Input.TextArea
                    maxLength={maxLength}
                    value={value}
                    {...restProps}
                    onChange={onChange}
                  />

                  <Icon
                    type="close-circle"
                    className="ant-input-textarea-clear-icon"
                  />
                </span>
                {showLengthCount && (
                  <span style={{ display: "block", textAlign: "right" }}>
                    {lengthCount}
                  </span>
                )}
              </>
            );
          }
          return (
            <Input.TextArea
              maxLength={maxLength}
              value={value}
              {...restProps}
              onChange={onChange}
            />
          );
        }}
      </LengthCount>
    );
  }
}

export default TextArea;

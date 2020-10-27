import React from 'react';
import Input, { InputProps } from 'antd/lib/input';

import LengthCount from './length-count';
import TextArea from './textarea';

export interface AweInputProps extends InputProps {
  showLengthCount?: boolean;
}

export class AweInput extends React.PureComponent<AweInputProps> {
  static TextArea = TextArea;

  render() {
    const {
      suffix,
      maxLength,
      showLengthCount,
      defaultValue,
      value,
      ...restProps
    } = this.props;
    const extraProps: AweInputProps = {};

    if ('value' in this.props) {
      extraProps.value = value;
    }
    if ('defaultValue' in this.props) {
      extraProps.defaultValue = defaultValue;
    }
    return (
      <LengthCount
        {...extraProps}
        maxLength={maxLength}
        showLengthCount={showLengthCount}
      >
        {({ lengthCount, onChange }) => (
          <Input
            {...restProps}
            suffix={showLengthCount ? lengthCount : suffix}
            maxLength={maxLength}
            onChange={onChange}
            {...extraProps}
          />
        )}
      </LengthCount>
    );
  }
}

export default AweInput;

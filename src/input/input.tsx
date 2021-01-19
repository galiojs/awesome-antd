import React from 'react';
import AntInput, { InputProps as AntInputProps } from 'antd/lib/input';

import LengthCount from './length-count';
import TextArea from './textarea';

export interface InputProps extends AntInputProps {
  showLengthCount: boolean;
}

export class Input extends React.PureComponent<InputProps> {
  static TextArea = TextArea;

  static defaultProps = {
    showLengthCount: false,
  };

  render() {
    const { suffix, showLengthCount, ...restProps } = this.props;

    return (
      <LengthCount {...this.props}>
        {({ lengthCount, onChange }) => (
          <AntInput
            {...restProps}
            suffix={showLengthCount ? lengthCount : suffix}
            onChange={onChange}
          />
        )}
      </LengthCount>
    );
  }
}

export default Input;

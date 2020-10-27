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
    const { suffix, showLengthCount, ...restProps } = this.props;

    return (
      <LengthCount {...this.props}>
        {({ lengthCount, onChange }) => (
          <Input
            {...restProps}
            suffix={showLengthCount ? lengthCount : suffix}
            onChange={onChange}
          />
        )}
      </LengthCount>
    );
  }
}

export default AweInput;

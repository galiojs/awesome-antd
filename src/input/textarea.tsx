import React from 'react';
import Input, { TextAreaProps } from 'antd/lib/input';

import LengthCount from './length-count';

export interface AweTextAreaProps extends TextAreaProps {
  showLengthCount?: boolean;
}

export class TextArea extends React.PureComponent<AweTextAreaProps> {
  static defaultProps: Partial<AweTextAreaProps> = {
    showLengthCount: false
  };

  render() {
    const { allowClear, showLengthCount, className, ...restProps } = this.props;

    return (
      <LengthCount {...this.props}>
        {({ lengthCount, onChange }) => {
          return (
            <>
              <Input.TextArea {...restProps} onChange={onChange} />
              {showLengthCount && <div style={{ textAlign: 'right' }}>{lengthCount}</div>}
            </>
          );
        }}
      </LengthCount>
    );
  }
}

export default TextArea;

import React from 'react';
import Input, { TextAreaProps } from 'antd/lib/input';

import LengthCount from './length-count';

export interface AweTextAreaProps extends TextAreaProps {
  showLengthCount: boolean;
}

export class TextArea extends React.PureComponent<AweTextAreaProps> {
  static defaultProps = {
    showLengthCount: false,
  };

  render() {
    const { showLengthCount, style, ...restProps } = this.props;
    const { width } = style || {};

    return (
      <LengthCount {...this.props}>
        {({ lengthCount, onChange }) => {
          return (
            <>
              <Input.TextArea style={style} {...restProps} onChange={onChange} />
              {showLengthCount && (
                <div
                  style={{ textAlign: 'right', width,lineHeight:'22px' }}
                  className="awe-input-textarea-length-count"
                >
                  {lengthCount}
                </div>
              )}
            </>
          );
        }}
      </LengthCount>
    );
  }
}

export default TextArea;

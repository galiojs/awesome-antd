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
    const { showLengthCount, style, ...restProps } = this.props;
    const { width } = style || {};

    return (
      <LengthCount {...this.props}>
        {({ lengthCount, onChange }) => {
          return (
            <>
              <Input.TextArea {...restProps} onChange={onChange} style={style} />
              {showLengthCount && (
                <div
                  className="awe-input-textarea-length-count"
                  style={{ textAlign: 'right', width }}
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

import React from 'react';
import Input, { TextAreaProps } from 'antd/lib/input';
import Icon from 'antd/lib/icon';

import LengthCount from './length-count';

export interface AweTextAreaProps extends TextAreaProps {
  showLengthCount?: boolean;
}

export interface TextAreaState {
  lengthCount: string;
}

export class TextArea extends React.PureComponent<AweTextAreaProps, TextAreaState> {
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
              <span
                className={`ant-input-affix-wrapper ant-input-affix-wrapper-textarea-with-clear-btn ${className ||
                  ''}`}
              >
                <Input.TextArea {...restProps} onChange={onChange} />

                <Icon type="close-circle" className="ant-input-textarea-clear-icon" />
              </span>
              {showLengthCount && <div style={{ textAlign: 'right' }}>{lengthCount}</div>}
            </>
          );
        }}
      </LengthCount>
    );
  }
}

export default TextArea;

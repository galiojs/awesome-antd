import React from 'react';
import Cascader, { CascaderProps } from 'antd/lib/cascader';

export { CascaderOptionType } from 'antd/lib/cascader';

export interface AweCascaderProps extends CascaderProps {
  autoFocus?: boolean;
  onFocus?(evt?: React.MouseEvent<HTMLSpanElement>): void;
}

export class AweCascader extends React.PureComponent<AweCascaderProps> {
  render() {
    return <Cascader {...this.props} />;
  }
}

export default AweCascader;

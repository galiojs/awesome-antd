import React from 'react';
import Select, { SelectProps } from 'antd/lib/select';

export interface AweSelectProps extends SelectProps {}

export class AweSelect extends React.PureComponent<AweSelectProps> {
  static OptGroup = Select.OptGroup;
  static Option = Select.Option;

  render() {
    return <Select {...this.props} />;
  }
}

export default AweSelect;

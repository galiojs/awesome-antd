import React from 'react';
import Select, { SelectProps } from 'antd/lib/select';

export class AweSelect extends React.PureComponent<SelectProps> {
  render() {
    return <Select {...this.props} />;
  }
}

export default AweSelect;

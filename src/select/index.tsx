import React from 'react';
import AntSelect, { SelectProps as AntSelectProps, OptionProps } from 'antd/lib/select';

export { OptionProps };

export interface SelectProps extends AntSelectProps {
  options?: OptionProps[];
}

export class Select extends React.PureComponent<SelectProps> {
  static OptGroup = AntSelect.OptGroup;
  static Option = AntSelect.Option;

  static defaultProps = {
    optionFilterProp: 'children',
  };

  render() {
    const { options, children, ...props } = this.props;
    const filterOption = generateFilterOption(this.props.optionFilterProp!);

    return (
      <AntSelect filterOption={filterOption} {...props}>
        {options
          ? options.map((option) => (
              <AntSelect.Option key={option.value} {...option}>
                {option.label}
              </AntSelect.Option>
            ))
          : children}
      </AntSelect>
    );
  }
}

export default Select;

function generateFilterOption(optionFilterProp: string) {
  return (
    inputValue: string,
    option: React.ReactElement<OptionProps & { [prop: string]: string }>
  ) =>
    String(option.props[optionFilterProp])
      .toLowerCase()
      .includes(String(inputValue).trim().toLowerCase());
}

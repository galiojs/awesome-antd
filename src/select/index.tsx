import React from 'react';
import AntSelect, {
  SelectProps as AntSelectProps,
  OptionProps,
  SelectValue,
} from 'antd/lib/select';

export { OptionProps };

export interface SelectProps<T = SelectValue | undefined> extends AntSelectProps<T> {
  options?: OptionProps[];
}

export class Select extends React.PureComponent<SelectProps> {
  static OptGroup = AntSelect.OptGroup;
  static Option = AntSelect.Option;

  static defaultProps = {
    optionFilterProp: 'children',
  };

  render() {
    const { filterOption, options, children, ...props } = this.props;
    const defaultFilterOption = generateFilterOption(this.props.optionFilterProp!);

    return (
      <AntSelect
        filterOption={filterOption === undefined ? defaultFilterOption : filterOption}
        {...props}
      >
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

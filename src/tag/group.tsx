import React from 'react';
import Tag from 'antd/lib/tag';

export interface TagsSelectOptionType {
  label: string | number;
  value: string | number;
}

export interface Group {
  options: Array<TagsSelectOptionType>;
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
}

export class AweTagGroup extends React.PureComponent<Group> {
  private _getChangeHandler = (tagValue: string | number) => (checked: boolean) => {
    const { value } = this.props;
    const nextSelectedTags = checked ? [...value, tagValue] : value.filter(t => t !== tagValue);
    this.props.onChange(nextSelectedTags);
  };

  render() {
    const { options, value } = this.props;
    return options.map(item => (
      <Tag.CheckableTag
        key={item.value}
        checked={value.includes(item.value)}
        onChange={this._getChangeHandler(item.value)}
      >
        {item.label}
      </Tag.CheckableTag>
    ));
  }
}
export default AweTagGroup;

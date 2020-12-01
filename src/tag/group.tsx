import React from 'react';
import Tag from 'antd/lib/tag';

export interface TagsSelectOptionType {
  label: string | number;
  key: string | number;
}

export interface AweTagsSelectProps {
  options: Array<TagsSelectOptionType>;
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
}

export class AweTagGroup extends React.PureComponent<AweTagsSelectProps> {
  handleChange = (tag: string | number, checked: boolean) => {
    const { value } = this.props;
    const nextSelectedTags = checked ? [...value, tag] : value.filter(t => t !== tag);
    this.props.onChange(nextSelectedTags);
  };

  render() {
    const { options, value } = this.props;
    return options.map(item => (
      <Tag.CheckableTag
        key={item.key}
        checked={value.includes(item.key)}
        onChange={checked => this.handleChange(item.key, checked)}
      >
        {item.label}
      </Tag.CheckableTag>
    ));
  }
}
export default AweTagGroup;

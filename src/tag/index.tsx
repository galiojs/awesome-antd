import React from 'react';
import Tag, { TagProps } from 'antd/lib/tag';
import CheckableTag, { CheckableTagProps } from 'antd/lib/tag/CheckableTag';

import Group from './group';

export class AweTag extends React.PureComponent<TagProps,CheckableTagProps> {
  static Group = Group;
  static CheckableTag = CheckableTag;

  render() {
    return <Tag {...this.props} />;
  }
}
export default AweTag;

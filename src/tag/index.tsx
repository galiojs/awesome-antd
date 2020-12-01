import React from 'react';
import Tag, { TagProps } from 'antd/lib/tag';

import AweTagGroup from './group';

export class AweTag extends React.PureComponent<TagProps> {
  static AweTagGroup = AweTagGroup;

  render() {
    return <Tag {...this.props} />;
  }
}
export default AweTag;

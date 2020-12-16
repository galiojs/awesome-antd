import React from 'react';
import Form from 'antd/lib/form';
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form';

import { FormContext } from './';

export interface EditableCellProps {
  editing: boolean;
  decorateOptions?: GetFieldDecoratorOptions;
  editingCtrl: React.ReactElement;
  id: string;
}

export class EditableCell extends React.PureComponent<EditableCellProps> {
  _renderCell = (form?: WrappedFormUtils) => {
    const { editing, decorateOptions, editingCtrl, id, children, ...restProps } = this.props;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {form?.getFieldDecorator(id, decorateOptions)(editingCtrl)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <FormContext.Consumer>{this._renderCell}</FormContext.Consumer>;
  }
}

export default EditableCell;

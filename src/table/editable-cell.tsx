import React from 'react';
import Form from 'antd/lib/form';
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form';

import { FormContext } from './';

export interface EditableCellProps<V> {
  editing: boolean;
  decorateOptions?: GetFieldDecoratorOptions;
  editingCtrl:
    | React.ReactElement
    | ((
        fieldsValue: V,
        others: { form: WrappedFormUtils<V>; children: React.ReactNode }
      ) => React.ReactElement);
  id: string;
}

export class EditableCell<V> extends React.PureComponent<EditableCellProps<V>> {
  _renderCell = (form: WrappedFormUtils<V>) => {
    const { editing, decorateOptions, editingCtrl, id, children, ...restProps } = this.props;

    let ctrl = null;
    if (React.isValidElement(editingCtrl)) {
      ctrl = editingCtrl;
    } else if (typeof editingCtrl == 'function') {
      ctrl = editingCtrl(form!.getFieldsValue() as V, { form, children });
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {React.isValidElement(ctrl) ? form?.getFieldDecorator(id, decorateOptions)(ctrl) : ctrl}
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

import React from 'react';
import Table, { TableProps, ColumnProps } from 'antd/lib/table';
import Form from 'antd/lib/form';
import {
  WrappedFormUtils,
  GetFieldDecoratorOptions,
  FormComponentProps,
  FormCreateOption,
} from 'antd/lib/form/Form';
import LocaleReceiver from 'antd/lib/locale-provider/LocaleReceiver';

import EditableCell, { EditableCellProps } from './editable-cell';
import AweButton from '../button';
import defaultLocale from './../locale/default';

export interface EditableTableLocale {
  actionsColumnTitle: string;
  saveBtn: string;
  cancelBtn: string;
  editBtn: string;
  deleteBtn: string;
}

export interface AweColumnProps<T> extends ColumnProps<T> {
  editable?: boolean;
  editingId?: string;
  editingCtrl?: React.ReactElement;
  decorateOptions?: GetFieldDecoratorOptions;
}

export interface AweTableProps<T, V> extends TableProps<T> {
  form: WrappedFormUtils<V>;
  rowKey: string | ((record: T, index: number) => string);
  columns: AweColumnProps<T>[];
  dataSource: T[];
  editingRowKey: string | null;
  onSave(editingRowKey: string, data: T[]): void;
  onEdit(rowKey: string): void;
  onCancel(unsetRowKey: typeof AweEditableTable.UNSET_EDITING_ROW_KEY): void;
  onDelete(rowKey: string, data: T[]): void;
}

export interface AweTableState {}

type BaseRecord = { [stringProp: string]: any; [numberProp: number]: any };

export class AweEditableTable<T extends BaseRecord, V = Partial<T>> extends React.PureComponent<
  AweTableProps<T, V>,
  AweTableState
> {
  static UNSET_EDITING_ROW_KEY = null;

  static defaultProps: Partial<AweTableProps<any, any>> = {
    rowKey: 'key',
    editingRowKey: AweEditableTable.UNSET_EDITING_ROW_KEY,
    pagination: false,
    onSave: () => {},
    onEdit: () => {},
    onCancel: () => {},
    onDelete: () => {},
  };

  private _canCancelSign =
    this.props.dataSource.length > 1 &&
    this.props.editingRowKey !== AweEditableTable.UNSET_EDITING_ROW_KEY;

  state: AweTableState = {};

  private _getRowKey = (record: T, rowIdx: number) => {
    const { rowKey } = this.props;
    const key: string = typeof rowKey == 'string' ? record[rowKey] : rowKey(record, rowIdx);

    return key;
  };

  private _canCancel = () => {
    return this._canCancelSign;
  };

  private _canDelete = () => {
    return (
      this.props.editingRowKey === AweEditableTable.UNSET_EDITING_ROW_KEY &&
      this.props.dataSource.length > 1
    );
  };

  private _isEditing = (record: T, rowIdx: number) => {
    const { editingRowKey } = this.props;

    return this._getRowKey(record, rowIdx) === editingRowKey;
  };

  private _saveHandler = (record: T, idx: number) => {
    const { form, onSave } = this.props;
    form.validateFields((errorMap, valueMap) => {
      if (errorMap) {
        return;
      }
      onSave(this._getRowKey(record, idx), this._getUpdatedData(record, idx, valueMap));
      this._canCancelSign = true;
    });
  };

  /**
   * If `valueMap` provided as `null`,
   * That means the caller wants to delete the row on index(`currentRowIdx`).
   */
  private _getUpdatedData = (currentRecord: T, currentRowIdx: number, valueMap: V | null) => {
    const { dataSource } = this.props;
    const rowKey = this._getRowKey(currentRecord, currentRowIdx);
    const updateIdx = dataSource.findIndex(
      (record, rowIdx) => rowKey === this._getRowKey(record, rowIdx)
    );

    if (updateIdx < 0) {
      return dataSource;
    }

    const data = [...dataSource];

    // deleting 1 row
    if (valueMap === null) {
      data.splice(updateIdx, 1);
    } else {
      data.splice(updateIdx, 1, { ...currentRecord, ...valueMap });
    }

    return data;
  };

  private _cancelHandler = () => {
    this.props.onCancel(AweEditableTable.UNSET_EDITING_ROW_KEY);
  };

  private _editHandler = (record: T, idx: number) => {
    this._canCancelSign = true;
    this.props.onEdit(this._getRowKey(record, idx));
  };

  private _deleteHandler = (record: T, idx: number) => {
    this.props.onDelete(this._getRowKey(record, idx), this._getUpdatedData(record, idx, null));
  };

  render() {
    const { form, columns, dataSource, editingRowKey, pagination } = this.props;

    const clmns: ColumnProps<T>[] = columns.map(
      ({ editable, editingId, editingCtrl, decorateOptions, ...clmn }) => {
        if (!editable) {
          return clmn;
        }

        return {
          ...clmn,
          onCell: (record: T, rowIdx: number): EditableCellProps => ({
            editing: this._isEditing(record, rowIdx),
            id: (editingId || (clmn.key as string) || clmn.dataIndex)!,
            editingCtrl: editingCtrl as React.ReactElement,
            decorateOptions: {
              initialValue: record[(clmn.key || clmn.dataIndex)!],
              ...decorateOptions,
            },
          }),
        };
      }
    );

    return (
      <FormContext.Provider value={form}>
        <LocaleReceiver componentName="EditableTable" defaultLocale={defaultLocale.EditableTable}>
          {(locale: EditableTableLocale, localeCode: string) => {
            const defaultActionsColumn = getDefaultActionsColumn<T>(
              {
                editingRowKey,
                canCancel: this._canCancel,
                canDelete: this._canDelete,
                isEditing: this._isEditing,
                onSave: this._saveHandler,
                onCancel: this._cancelHandler,
                onEdit: this._editHandler,
                onDelete: this._deleteHandler,
              },
              { ...locale, localeCode }
            );

            return (
              <Table<T>
                components={{ body: { cell: EditableCell } }}
                columns={[...clmns, defaultActionsColumn]}
                dataSource={dataSource}
                pagination={pagination}
              />
            );
          }}
        </LocaleReceiver>
      </FormContext.Provider>
    );
  }
}

export const createEditableTable = <T, V>(
  options?: FormCreateOption<AweTableProps<T, V> & FormComponentProps<V>>
): React.ComponentClass<Partial<AweTableProps<T, V>>> =>
  Form.create(options)(AweEditableTable) as any;

export default Table;

export const FormContext = React.createContext<WrappedFormUtils | undefined>(undefined);

interface GetDefaultActionsColumnOpts<T> {
  editingRowKey: string | null;
  canCancel(record: T, idx: number): boolean;
  canDelete(record: T, idx: number): boolean;
  isEditing(record: T, idx: number): boolean;
  onSave(record: T, idx: number): void;
  onCancel(): void;
  onEdit(record: T, idx: number): void;
  onDelete(record: T, idx: number): void;
}

const getDefaultActionsColumn = <T extends object>(
  {
    editingRowKey,
    canCancel,
    canDelete,
    isEditing,
    onSave,
    onCancel,
    onEdit,
    onDelete,
  }: GetDefaultActionsColumnOpts<T>,
  locale: EditableTableLocale & { localeCode: string }
): AweColumnProps<T> => ({
  title: locale.actionsColumnTitle,
  key: '__awe-table-default-actions-column',
  width: locale.localeCode === 'zh_CN' ? 100 : 120,
  render(__, record, idx) {
    const editing = isEditing(record, idx);

    return editing ? (
      <span>
        <AweButton
          aria-label="button: save"
          style={{ marginRight: 8 }}
          type="link"
          onClick={() => {
            onSave(record, idx);
          }}
        >
          {locale.saveBtn}
        </AweButton>
        <AweButton
          aria-label="button: cancel"
          type="link"
          disabled={!canCancel(record, idx)}
          onClick={() => {
            onCancel();
          }}
        >
          {locale.cancelBtn}
        </AweButton>
      </span>
    ) : (
      <span>
        <AweButton
          aria-label="button: edit"
          style={{ marginRight: 8 }}
          type="link"
          disabled={editingRowKey !== AweEditableTable.UNSET_EDITING_ROW_KEY}
          onClick={() => {
            onEdit(record, idx);
          }}
        >
          {locale.editBtn}
        </AweButton>
        <AweButton
          aria-label="button: delete"
          type="link"
          disabled={!canDelete(record, idx)}
          onClick={() => {
            onDelete(record, idx);
          }}
        >
          {locale.deleteBtn}
        </AweButton>
      </span>
    );
  },
});

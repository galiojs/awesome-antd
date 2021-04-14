import React from 'react';
import omit from 'lodash.omit';
import get from 'lodash.get';
import pick from 'lodash.pick';
import Table, { TableProps, ColumnProps } from 'antd/lib/table';
import Form from 'antd/lib/form';
import { WrappedFormUtils, GetFieldDecoratorOptions, FormCreateOption } from 'antd/lib/form/Form';
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

export interface AweColumnProps<T, V = Partial<T>> extends ColumnProps<T> {
  editable?: boolean;

  /**
   * Cell merge strategy
   * > Note: this API is only valid when `editable: true`.
   * - `rows: true` to indicate that this column will merge rows by Table prop `mergeProp`.
   */
  mergeStrategy?: {
    rows?: boolean;
  };

  editingId?: string;
  editingCtrl?:
    | React.ReactElement
    | ((
        fieldsValue: V,
        others: { form: WrappedFormUtils<V>; children: React.ReactNode }
      ) => React.ReactElement);
  decorateOptions?: GetFieldDecoratorOptions;
}

export interface AweTableProps<T, V> extends TableProps<T> {
  form: WrappedFormUtils<V>;
  rowKey: string | ((record: T, index: number) => string);

  /**
   * Merge rows by this property.
   */
  mergeProp: string;

  columns: AweColumnProps<T, V>[];
  dataSource: T[];
  editingRowKey: string | null;
  showActionsColumn: boolean;
  validateFieldIds?: string[];
  forceValidateOnSave: boolean;
  canDelete(record: T, idx: number, hasEditingRow: boolean): boolean;
  onSave(editingRowKey: string, data: T[]): void;
  onEdit(rowKey: string): void;
  onCancel(rowKey: string): void;
  onDelete(rowKey: string, data: T[]): void;
}

export interface AweTableState {}

export class AweEditableTable<T extends object, V = Partial<T>> extends React.PureComponent<
  AweTableProps<T, V>,
  AweTableState
> {
  static UNSET_EDITING_ROW_KEY = null;

  static defaultProps: Partial<AweTableProps<any, any>> = {
    rowKey: 'key',
    editingRowKey: AweEditableTable.UNSET_EDITING_ROW_KEY,
    showActionsColumn: true,
    forceValidateOnSave: false,
    pagination: false,
    canDelete: (_record, _idx, hasEditingRow) => hasEditingRow,
    onSave: () => {},
    onEdit: () => {},
    onCancel: () => {},
    onDelete: () => {},
  };

  state: AweTableState = {};

  private _getRowKey = (record: T, rowIdx: number) => {
    const { rowKey } = this.props;
    const key: string =
      typeof rowKey == 'string' ? (record as any)[rowKey] : rowKey(record, rowIdx);

    return key;
  };

  private _hasEditingRow = () => {
    return this.props.editingRowKey === AweEditableTable.UNSET_EDITING_ROW_KEY;
  };

  private _canDelete = (record: T, idx: number) => {
    return this.props.canDelete(record, idx, this._hasEditingRow());
  };

  private _isEditing = (record: T, rowIdx: number) => {
    const { editingRowKey } = this.props;

    return this._getRowKey(record, rowIdx) === editingRowKey;
  };

  private _saveHandler = (record: T, idx: number) => {
    const { form, validateFieldIds, forceValidateOnSave, onSave } = this.props;
    form.validateFields(
      validateFieldIds! /* undefined is ok */,
      { force: forceValidateOnSave },
      (errorMap: any, valueMap: V) => {
        if (errorMap) {
          return;
        }
        onSave(this._getRowKey(record, idx), this._getUpdatedData(record, idx, valueMap));
      }
    );
  };

  private _getFormItemId = (editingId?: string, key?: string, dataIndex?: string) => {
    return (editingId || key || dataIndex)!;
  };

  /**
   * If `valueMap` provided as `null`,
   * That means the caller wants to delete the row on index(`currentRowIdx`).
   */
  private _getUpdatedData = (currentRecord: T, currentRowIdx: number, valueMap: V | null) => {
    const { dataSource, mergeProp, columns } = this.props;
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

      return data;
    }

    data.splice(updateIdx, 1, { ...currentRecord, ...valueMap });
    if (typeof mergeProp != 'string') {
      return data;
    }

    const mergePropRef = get(dataSource[updateIdx], mergeProp);
    if (mergePropRef === undefined) {
      process.env.NODE_ENV === 'development' &&
        console.error(
          '[@galiojs/awesome-antd EditableTable]: `mergeProp` is required but undefined on row(%s).',
          updateIdx,
          dataSource[updateIdx]
        );
      return data;
    }

    const mergeRowIdxes: number[] = [];
    dataSource.forEach((record, idx) => {
      if (idx !== updateIdx && get(record, mergeProp, null) === mergePropRef) {
        mergeRowIdxes.push(idx);
      }
    });
    const mergeIds: string[] = [];
    columns.forEach((column) => {
      if (column.editable && column.mergeStrategy?.rows) {
        const id = this._getFormItemId(column.editingId, column.key as string, column.dataIndex);
        mergeIds.push(id);
      }
    });
    const mergeValueMap = pick(valueMap, mergeIds);
    mergeRowIdxes.forEach((mergeRowIdx) => {
      data.splice(mergeRowIdx, 1, {
        ...data[mergeRowIdx],
        ...mergeValueMap,
      });
    });

    return data;
  };

  private _cancelHandler = (record: T, idx: number) => {
    this.props.onCancel(this._getRowKey(record, idx));
  };

  private _editHandler = (record: T, idx: number) => {
    this.props.onEdit(this._getRowKey(record, idx));
  };

  private _deleteHandler = (record: T, idx: number) => {
    this.props.onDelete(this._getRowKey(record, idx), this._getUpdatedData(record, idx, null));
  };

  render() {
    const { form, columns, dataSource, editingRowKey, showActionsColumn, pagination } = this.props;
    const tableProps: TableProps<T> = omit(this.props, OWN_PROPS);

    const clmns: ColumnProps<T>[] = showActionsColumn
      ? columns.map(({ editable, editingId, editingCtrl, decorateOptions, ...clmn }) => {
          if (!editable) {
            return clmn;
          }

          const id = this._getFormItemId(editingId, clmn.key as string, clmn.dataIndex);

          return {
            ...clmn,
            onCell: (record: T, rowIdx: number): EditableCellProps<V> => ({
              editing: this._isEditing(record, rowIdx),
              id,
              editingCtrl: editingCtrl as React.ReactElement,
              decorateOptions: {
                initialValue: get(record, id),
                ...decorateOptions,
              },
            }),
          };
        })
      : columns;

    return (
      <FormContext.Provider value={form}>
        <LocaleReceiver componentName="EditableTable" defaultLocale={defaultLocale.EditableTable}>
          {(locale: EditableTableLocale, localeCode: string) => {
            let finalColumns = clmns;

            if (showActionsColumn) {
              const defaultActionsColumn = getDefaultActionsColumn<T, V>(
                {
                  editingRowKey,
                  canDelete: this._canDelete,
                  isEditing: this._isEditing,
                  onSave: this._saveHandler,
                  onCancel: this._cancelHandler,
                  onEdit: this._editHandler,
                  onDelete: this._deleteHandler,
                },
                { ...locale, localeCode }
              );

              finalColumns = [...clmns, defaultActionsColumn];
            }

            return (
              <Table<T>
                {...tableProps}
                components={{ body: { cell: EditableCell } }}
                columns={finalColumns}
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

export interface CreateEditableTableFunc {
  <T = {}, V = {}, E = {}>(
    options?: FormCreateOption<AweTableProps<T, V> & E>
  ): React.ComponentClass<
    Omit<JSX.LibraryManagedAttributes<typeof AweEditableTable, AweTableProps<T, V>>, 'form'> & E
  >;
}

export const createEditableTable: CreateEditableTableFunc = (options) =>
  Form.create(options)(AweEditableTable as any) as any;

export default Table;

export const FormContext = React.createContext<WrappedFormUtils | undefined>(undefined);

const OWN_PROPS = [
  'form',
  'editingRowKey',
  'showActionsColumn',
  'validateFieldIds',
  'forceValidateOnSave',
  'canDelete',
  'onSave',
  'onEdit',
  'onCancel',
  'onDelete',
];

interface GetDefaultActionsColumnOpts<T> {
  editingRowKey: string | null;
  canDelete(record: T, idx: number): boolean;
  isEditing(record: T, idx: number): boolean;
  onSave(record: T, idx: number): void;
  onCancel(record: T, idx: number): void;
  onEdit(record: T, idx: number): void;
  onDelete(record: T, idx: number): void;
}

const getDefaultActionsColumn = <T extends object, V = Partial<T>>(
  {
    editingRowKey,
    canDelete,
    isEditing,
    onSave,
    onCancel,
    onEdit,
    onDelete,
  }: GetDefaultActionsColumnOpts<T>,
  locale: EditableTableLocale & { localeCode: string }
): AweColumnProps<T, V> => ({
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
          onClick={() => {
            onCancel(record, idx);
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

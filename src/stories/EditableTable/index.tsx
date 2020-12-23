import React, { useState, useCallback } from 'react';
import { Input, InputNumber, Icon, Select } from 'antd';
import 'antd/dist/antd.min.css';

import { createEditableTable, AweColumnProps } from './../../table';
import { generateGetRowSpan } from './../../table/utils';

interface Record {
  key: string;
  mergeRowsKey?: string;
  name?: string;
  age?: number;
  child?: string;
}

interface GetColumnsOpts {
  showActionsColumn: boolean;
  addRow(rowData: Record, insertIdx?: number): void;
  getRowSpan(record: Record, idx: number): number;
}

export interface EditableTableProps {
  defaultData?: Record[];
  defaultEditingRowKey?: string | null;
  showActionsColumn: boolean;
}

const generateRowKey = () => 'row-' + Math.random();

const getInitialRowData = (mergeRowsKey?: string): Record => {
  const key = generateRowKey();

  return {
    key,
    mergeRowsKey: mergeRowsKey || key,
    name: undefined,
    age: undefined,
    child: undefined,
  };
};

export const NAME_REQUIRED_ERROR_MESSAGE = 'name is required';
export const AGE_REQUIRED_ERROR_MESSAGE = 'age is required';

const AweEditableTable = createEditableTable<Record, Omit<Record, 'key'>>();

const childValidator = (
  _rule: any,
  child: string,
  callback: Function,
  { age }: { age?: number }
) => {
  if (age !== undefined && age < 22 && child) {
    callback('Child is not allowed.');
    return;
  }
  callback();
};

const getColumns = ({
  showActionsColumn,
  addRow,
  getRowSpan,
}: GetColumnsOpts): AweColumnProps<Record>[] => [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: true,
    editingCtrl: <Input aria-label="field: name" style={{ width: 200 }} />,
    decorateOptions: {
      rules: [{ required: true, message: NAME_REQUIRED_ERROR_MESSAGE }],
    },
    render(name, record, idx) {
      let children = name;
      if (idx === 0 && showActionsColumn) {
        children = (
          <span>
            <Icon
              style={{ marginRight: 8 }}
              type="plus-circle"
              onClick={() => {
                addRow(getInitialRowData());
              }}
            />
            {name}
          </span>
        );
      }

      return {
        children,
        props: {
          rowSpan: getRowSpan(record, idx),
        },
      };
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    editable: true,
    editingCtrl: <InputNumber />,
    decorateOptions: {
      rules: [{ required: true, message: AGE_REQUIRED_ERROR_MESSAGE }],
    },
    render(age, record, idx) {
      return {
        children: age,
        props: {
          rowSpan: getRowSpan(record, idx),
        },
      };
    },
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    editable: true,
    editingCtrl: (
      <Select style={{ minWidth: 80 }}>
        <Select.Option value="F">Female</Select.Option>
        <Select.Option value="M">Male</Select.Option>
        <Select.Option value="UNKNOW">Unknow</Select.Option>
      </Select>
    ),
    render(gender, record, idx) {
      return {
        children: gender,
        props: {
          rowSpan: getRowSpan(record, idx),
        },
      };
    },
  },
  {
    title: 'Children',
    dataIndex: 'child',
    editable: true,
    editingCtrl: <Input style={{ width: 200 }} placeholder="Child name" />,
    decorateOptions: {
      rules: [{ validator: childValidator }],
    },
    render(child, record, idx) {
      const rowSpan = getRowSpan(record, idx);
      if (rowSpan >= 1 && showActionsColumn && child) {
        return (
          <span>
            <Icon
              style={{ marginRight: 8 }}
              type="plus-circle"
              onClick={() => {
                addRow(
                  {
                    ...record,
                    key: generateRowKey(),
                    mergeRowsKey: record.mergeRowsKey,
                    child: undefined,
                  },
                  idx
                );
              }}
            />
            {child}
          </span>
        );
      }

      return child;
    },
  },
];

const EditableTable = ({
  defaultData = [getInitialRowData()],
  defaultEditingRowKey,
  showActionsColumn = true,
}: EditableTableProps) => {
  const [data, setData] = useState<Record[]>(defaultData);
  const [editingRowKey, setEditingRowKey] = useState<string | null>(
    defaultEditingRowKey === undefined ? defaultData[0].key : defaultEditingRowKey
  );
  const [deleteByCancel, setDeleteByCancel] = useState(false);

  const addRow = (rowData: Record, insertIdx = 0) => {
    setData((prevData) => {
      const nextData = [...prevData];
      nextData.splice(insertIdx, 0, rowData);

      return nextData;
    });
    setEditingRowKey(rowData.key);
    setDeleteByCancel(true);
  };

  const getRowSpan = useCallback(generateGetRowSpan(data), [data]);

  return (
    <AweEditableTable
      forceValidateOnSave
      showActionsColumn={showActionsColumn}
      columns={getColumns({ showActionsColumn, addRow, getRowSpan })}
      dataSource={data}
      editingRowKey={editingRowKey}
      onEdit={(rowKey) => {
        setEditingRowKey(rowKey);
      }}
      onCancel={() => {
        if (deleteByCancel) {
          setData((prevData) => {
            const nextData = [...prevData];
            const idx = nextData.findIndex((record) => record.key === editingRowKey);
            if (idx > -1) {
              nextData.splice(idx, 1);
            }

            return nextData;
          });
        }
        setEditingRowKey(null);
      }}
      onSave={(__, data) => {
        setData(data);
        setEditingRowKey(null);
        setDeleteByCancel(false);
      }}
      onDelete={(rowKey, data) => {
        setData(data);
        if (rowKey === editingRowKey) {
          setEditingRowKey(null);
        }
      }}
    />
  );
};

export default EditableTable;

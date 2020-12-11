import React from 'react';
import { Input, InputNumber, Icon, Select } from 'antd';
import 'antd/dist/antd.min.css';

import { createEditableTable, AweColumnProps } from './../../table';

interface Record {
  key: string;
  mergeRowsKey?: string;
  name?: string;
  age?: number;
  child?: string;
}

interface GetColumnsOpts {
  addRow(rowData: Record): void;
  getRowSpan(record: Record, idx: number): number;
}

const getInitialRowData = (mergeRowsKey?: string): Record => {
  const key = 'row-' + Math.random();

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

const getColumns = ({ addRow, getRowSpan }: GetColumnsOpts): AweColumnProps<Record>[] => [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: true,
    editingCtrl: <Input style={{ width: 200 }} />,
    decorateOptions: {
      rules: [{ required: true, message: NAME_REQUIRED_ERROR_MESSAGE }],
    },
    render(name, record, idx) {
      let children = name;
      if (idx === 0) {
        children = (
          <span>
            <Icon
              style={{ marginRight: 8 }}
              type="plus-circle"
              onClick={() => {
                addRow(getInitialRowData());
                // addRow({
                //   ...record,
                //   key: 'row-' + Math.random(),
                //   mergeRowsKey: record.mergeRowsKey,
                //   child: undefined,
                // });
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
    render(child, record, idx) {
      const rowSpan = getRowSpan(record, idx);
      if (rowSpan >= 1) {
        return (
          <span>
            <Icon
              style={{ marginRight: 8 }}
              type="plus-circle"
              onClick={() => {
                addRow({
                  ...record,
                  key: 'row-' + Math.random(),
                  mergeRowsKey: record.mergeRowsKey,
                  child: undefined,
                });
              }}
            />
            {child}
          </span>
        );
      }

      return child;
    },
    // editingCtrlExtraRender: (editingCtrl, record) => (
    //   <span>
    //     {editingCtrl}
    // <Icon
    //   style={{ marginLeft: 8 }}
    //   type="plus-circle"
    //   onClick={() => {
    //     addRow({ ...record, mergeRowsKey: record.mergeRowsKey, child: undefined });
    //   }}
    // />
    //   </span>
    // ),
  },
];

const AweEditableTable = createEditableTable<Record, Omit<Record, 'key'>>();

const EditableTable = () => {
  const [data, setData] = React.useState([getInitialRowData()]);
  const [editingRowKey, setEditingRowKey] = React.useState<string | null>(data[0].key);

  const addRow = (rowData: Record) => {
    setData((prevData) => [rowData, ...prevData]);
    setEditingRowKey(rowData.key);
  };

  const getRowSpan = (record: Record, idx: number) => {
    if (data[idx - 1]?.mergeRowsKey === record.mergeRowsKey) {
      return 0;
    }

    let span = 1;
    const dataSlice = data.slice(idx + 1);
    for (let index = 0; index < dataSlice.length; index++) {
      const element = dataSlice[index];
      if (element.mergeRowsKey !== record.mergeRowsKey) {
        break;
      }
      span++;
    }

    return span;
  };

  return (
    <AweEditableTable
      columns={getColumns({ addRow, getRowSpan })}
      dataSource={data}
      editingRowKey={editingRowKey}
      onEdit={(rowKey) => {
        setEditingRowKey(rowKey);
      }}
      onCancel={() => {
        setEditingRowKey(null);
      }}
      onSave={(__, data) => {
        setData(data);
        setEditingRowKey(null);
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

import React, { useState } from 'react';
import InputNumber from 'antd/lib/input-number';
import Form from 'antd/lib/form';

import { createFiltersForm, FormItem, FiltersFormProps } from './../../filters-form';
import Input from './../../input';
import Select from './../../select';

import './../../filters-form/style';

export interface FieldsValue {
  username?: string;
  age?: number;
  salary?: number;
  job?: string;
  gender?: 'F' | 'M' | 'UNKNOW';
  children?: string;
}

export type OnFieldsChangeFunc = (fields: any) => void;

export interface Props {
  defaultExpanded?: boolean;
  onFieldsChange?: OnFieldsChangeFunc;
  onSearch?: FiltersFormProps<FieldsValue>['onSearch'];
  onReset?: FiltersFormProps<FieldsValue>['onReset'];
}

const FiltersForm = createFiltersForm<
  FieldsValue,
  { fields: Record<keyof FieldsValue, { value: any }>; onFieldsChange: OnFieldsChangeFunc }
>({
  onFieldsChange: (props, _fields, allFields) => {
    props.onFieldsChange(allFields);
  },
  mapPropsToFields: (props) => ({
    username: Form.createFormField(props.fields.username),
    age: Form.createFormField(props.fields.age),
    salary: Form.createFormField(props.fields.salary),
    job: Form.createFormField(props.fields.job),
    gender: Form.createFormField(props.fields.gender),
    children: Form.createFormField(props.fields.children),
  }),
});

export const items: FormItem[] = [
  { label: 'User Name', id: 'username', control: <Input /> },
  { label: 'Age', id: 'age', control: <InputNumber /> },
  { label: 'Salary', id: 'salary', control: <InputNumber /> },
  { label: 'Job', id: 'job', control: <Input /> },
  {
    label: 'Gender',
    id: 'gender',
    decorateOptions: ({ fields }) => ({
      initialValue: fields.gender.value,
    }),
    control: (
      <Select allowClear>
        <Select.Option value="F">Female</Select.Option>
        <Select.Option value="M">Male</Select.Option>
        <Select.Option value="UNKNOW">Unknow</Select.Option>
      </Select>
    ),
  },
  { label: 'Children', id: 'children', control: <Input /> },
];

const App: React.FC<Props> = ({ defaultExpanded = false, onFieldsChange, onSearch, onReset }) => {
  const [fields, setFields] = useState<Record<keyof FieldsValue, { value: any }>>({
    username: { value: undefined },
    age: { value: undefined },
    salary: { value: undefined },
    job: { value: undefined },
    gender: { value: undefined },
    children: { value: undefined },
  });

  return (
    <FiltersForm
      defaultExpanded={defaultExpanded}
      items={items}
      fields={fields}
      onFieldsChange={(fields) => {
        setFields(fields);
        onFieldsChange && onFieldsChange(fields);
      }}
      onSearch={onSearch}
      onReset={onReset}
    />
  );
};

export default App;

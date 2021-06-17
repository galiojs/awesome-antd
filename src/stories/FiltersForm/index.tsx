import React, { useState } from 'react';
import InputNumber from 'antd/lib/input-number';
import Form from 'antd/lib/form';
import omit from 'lodash.omit';

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

export type Fields = {
  username: {
    value: FieldsValue['username'];
  };
  age: {
    value: FieldsValue['age'];
  };
  salary: {
    value: FieldsValue['salary'];
  };
  job: {
    value: FieldsValue['job'];
  };
  gender: {
    value: FieldsValue['gender'];
  };
  children: {
    value: FieldsValue['children'];
  };
};

export type OnFieldsChangeFunc = (fields: any) => void;

export interface Props {
  defaultExpanded?: boolean;
  onFieldsChange?: OnFieldsChangeFunc;
  onSearch?: FiltersFormProps<FieldsValue>['onSearch'];
  onReset?: FiltersFormProps<FieldsValue>['onReset'];
}

export type ExtraProps = { fields: Fields; onFieldsChange: OnFieldsChangeFunc };

export type SyntheticFiltersFormProps = FiltersFormProps<FieldsValue> & ExtraProps;

const FiltersForm = createFiltersForm<FieldsValue, ExtraProps>({
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

const items: FormItem<SyntheticFiltersFormProps>[] = [
  {
    label: 'User Name',
    id: 'username',
    decorateOptions: ({ fields }) => ({
      initialValue: fields.username.value,
    }),
    control: <Input />,
  },
  {
    label: 'Age',
    id: 'age',
    decorateOptions: ({ fields }) => ({
      initialValue: fields.age.value,
    }),
    control: <InputNumber />,
  },
  {
    label: 'Salary',
    id: 'salary',
    decorateOptions: ({ fields }) => ({
      initialValue: fields.salary.value,
    }),
    control: <InputNumber />,
  },
  {
    label: 'Job',
    id: 'job',
    decorateOptions: ({ fields }) => ({
      initialValue: fields.job.value,
    }),
    control: <Input />,
  },
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
  {
    label: 'Children',
    id: 'children',
    decorateOptions: ({ fields }) => ({
      initialValue: fields.children.value,
    }),
    control: <Input />,
  },
];

// for the stories that without 2-way databinding
export const itemsWithoutDecorateOptions: FormItem[] = items.map((item) =>
  omit(item, ['decorateOptions'])
);

const initialFields: Fields = {
  username: { value: undefined },
  age: { value: undefined },
  salary: { value: undefined },
  job: { value: undefined },
  gender: { value: undefined },
  children: { value: undefined },
};

const App: React.FC<Props> = ({ defaultExpanded = false, onFieldsChange, onSearch, onReset }) => {
  const [fields, setFields] = useState<Fields>(initialFields);

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

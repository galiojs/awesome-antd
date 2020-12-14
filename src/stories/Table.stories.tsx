import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import EditableTable, { EditableTableProps } from './EditableTable';

export default {
  title: 'Example/EditableTable',
  component: EditableTable,
} as Meta;

const Template: Story<EditableTableProps> = (args) => <EditableTable {...args} />;

export const FamilyTreeTable = Template.bind({});
FamilyTreeTable.args = {
  defaultData: [
    {
      key: 'row-0.7680511899736875',
      mergeRowsKey: 'row-0.7680511899736875',
      name: 'Emma',
      age: 22,
      child: 'Fruit',
      gender: 'F',
    },
    {
      key: 'row-0.8981918115495107',
      mergeRowsKey: 'row-0.3092834939272744',
      name: 'Jerry',
      age: 30,
      child: 'Alice',
      gender: 'M',
    },
    {
      key: 'row-0.3092834939272744',
      mergeRowsKey: 'row-0.3092834939272744',
      name: 'Jerry',
      age: 30,
      child: 'Fruit',
      gender: 'M',
    },
  ],
  defaultEditingRowKey: 'row-0.7680511899736875',
};

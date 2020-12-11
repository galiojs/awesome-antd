import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import EditableTable from './EditableTable';

export default {
  title: 'Example/EditableTable',
  component: EditableTable,
} as Meta;

const Template: Story = (args) => <EditableTable {...args} />;

export const UserTable = Template.bind({});
UserTable.args = {};

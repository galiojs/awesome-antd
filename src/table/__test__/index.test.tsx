import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditableTable, {
  NAME_REQUIRED_ERROR_MESSAGE,
  AGE_REQUIRED_ERROR_MESSAGE,
} from './../../stories/EditableTable';

describe('Testing <AweEditableTable />', () => {
  test('Add, edit, delete rows.', async () => {
    render(<EditableTable />);

    const saveBtn = screen.getByLabelText('button: save');
    await userEvent.click(saveBtn);

    expect(screen.getByText(NAME_REQUIRED_ERROR_MESSAGE)).toBeInTheDocument();
    expect(screen.getByText(AGE_REQUIRED_ERROR_MESSAGE)).toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: 'field: name' }), 'Jerry');
    await userEvent.type(screen.getByRole('spinbutton'), '29');

    await userEvent.click(saveBtn);

    expect(screen.getByText('Jerry')).toBeInTheDocument();
    expect(screen.getByText('29')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('button: edit'));

    expect(screen.queryByLabelText('button: edit')).toBeNull();

    await userEvent.clear(screen.getByRole('spinbutton'));

    expect(screen.getByText(AGE_REQUIRED_ERROR_MESSAGE)).toBeInTheDocument();

    await userEvent.type(screen.getByRole('spinbutton'), '30');

    await userEvent.click(screen.getByLabelText('button: save'));

    await userEvent.click(screen.getByLabelText('icon: plus-circle'));

    const editBtns = screen.getAllByLabelText('button: edit');
    editBtns.forEach((editBtn) => {
      expect(editBtn).toHaveAttribute('disabled');
    });
  });
});

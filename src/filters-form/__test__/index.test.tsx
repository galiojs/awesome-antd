import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FiltersForm, { FieldsValue } from './../../stories/FiltersForm';

const Demo: React.FC<{ width: number }> = ({ width }) => (
  <div style={{ width }}>
    <FiltersForm />
  </div>
);

describe('Testing <FiltersForm />', () => {
  test('Hide extra form items according to form width.', () => {
    render(<Demo width={1200} />);

    const form = screen.getByRole('form');
    expect(form.childElementCount).toEqual(4);
  });

  test('Handle onSearch, onReset, onFieldsChange.', async () => {
    const fieldsChangeHandler = jest.fn((fields: any) => fields.username.value);
    const searchHandler = jest.fn((fieldsValue: FieldsValue) => fieldsValue);
    const resetHandler = jest.fn((fieldsReset: boolean) => fieldsReset);

    render(
      <FiltersForm
        defaultExpanded
        onFieldsChange={fieldsChangeHandler}
        onSearch={searchHandler}
        onReset={resetHandler}
      />
    );

    const usernameInput = screen.getByRole('textbox', {
      name: (_, element) => element.id === 'username',
    });
    await userEvent.type(usernameInput, 'Jerry');
    expect(fieldsChangeHandler.mock.calls.length).toBe(5);
    expect(fieldsChangeHandler.mock.results[4].value).toBe('Jerry');

    await userEvent.click(screen.getByLabelText('button: submit'));
    expect(searchHandler.mock.results[0].value).toStrictEqual<FieldsValue>({
      username: 'Jerry',
      age: undefined,
      salary: undefined,
      job: undefined,
      gender: undefined,
      children: undefined,
    });

    await userEvent.click(screen.getByLabelText('button: reset'));
    expect(resetHandler.mock.results[0].value).toBe(true);
  });
});

import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AweApiSelect from './..';

jest.mock('axios');

const dataService = async () => {
  const result = await axios.get(`/api/mock/options`);

  return result.data;
};

const options = [
  { text: 'Hello(1)', label: 'Hello', value: '1' },
  { text: 'React(2)', label: 'React', value: '2' },
];

describe('Testing <AweApiSelect />', () => {
  test('fetches options from an API and displays them', async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(<AweApiSelect dataService={dataService} />);

    await userEvent.click(screen.getByRole('combobox'));

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
  });

  test('turns on `requestOnDidMount`', async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(<AweApiSelect defaultOpen requestOnDidMount dataService={dataService} />);

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
  });

  test('customized `fieldNames`', async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(
      <AweApiSelect
        showSearch
        defaultOpen
        requestOnDidMount
        fieldNames={{ label: ({ label, value }) => `${label}-${value}`, dataLabel: 'text' }}
        dataService={dataService}
      />
    );

    // customized fieldname `label`
    await screen.findByText('Hello-1');
    await screen.findByText('React-2');

    // customized fieldname `dataLabel`
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello(1)' } });
    expect(screen.getByText('Hello-1')).toBeInTheDocument();
    expect(screen.queryByText('React-2')).toBeNull();
  });
});

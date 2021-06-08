import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ApiSelect from './..';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const dataService = async () => {
  const result = await axios.get('/api/mock/options');

  return result.data;
};

const searchDataService = async (keyword: string) => {
  const result = await axios.get('/api/mock/options/by/keyword', { params: { keyword } });

  return result.data;
};

const options = [
  { text: 'Hello(1)', label: 'Hello', value: '1' },
  { text: 'React(2)', label: 'React', value: '2' },
];

describe('Testing <ApiSelect />', () => {
  test('fetches options from an API and displays them', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(<ApiSelect dataService={dataService} />);

    await userEvent.click(screen.getByRole('combobox'));

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
  });

  test('did mount mode', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(<ApiSelect defaultOpen trigger="onDidMount" dataService={dataService} />);

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
  });

  test('customized `fieldNames`', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(
      <ApiSelect
        showSearch
        defaultOpen
        trigger="onDidMount"
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

  test('search mode', async () => {
    mockedAxios.get.mockImplementation((__, { params: { keyword } }) => {
      return Promise.resolve({
        data: options.filter(({ label }) =>
          String(label).toLowerCase().includes(String(keyword).toLowerCase())
        ),
      });
    });

    render(<ApiSelect trigger="onSearch" dataService={searchDataService} />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    await screen.findByText('Hello');
    expect(screen.queryByText('React')).toBeNull();

    await userEvent.clear(screen.getByRole('textbox'));
    await screen.findByText('Hello');

    await userEvent.type(screen.getByRole('textbox'), 'react');
    await screen.findByText('React');
  });

  test('Re-fetches options depends on service queries.', async () => {
    mockedAxios.get.mockImplementation((__, { params: { keyword } }) => {
      return Promise.resolve({
        data: options.filter(({ label }) =>
          String(label).toLowerCase().includes(String(keyword).toLowerCase())
        ),
      });
    });

    const { rerender } = render(
      <ApiSelect serviceQueries={['hello']} dataService={searchDataService} />
    );

    await userEvent.click(screen.getByRole('combobox'));
    await screen.findByText('Hello');
    expect(screen.queryByText('React')).toBeNull();

    rerender(<ApiSelect serviceQueries={['react']} dataService={searchDataService} />);
    await screen.findByText('React');
    expect(screen.queryByText('Hello')).toBeNull();
  });

  test('Option with value & Label in value', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(
      <ApiSelect
        allowClear
        optionWithValue
        labelInValue
        dataService={searchDataService}
        onChange={() => {}}
      />
    );

    const combobox = screen.getByRole('combobox');
    await userEvent.click(combobox);
    const optionHello = await screen.findByText('Hello');
    await userEvent.click(optionHello);
    await userEvent.click(screen.getByLabelText('icon: close-circle'));
  });
});

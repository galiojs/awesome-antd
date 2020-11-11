import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AweApiSelect from './..';

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

describe('Testing <AweApiSelect />', () => {
  test('fetches options from an API and displays them', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(<AweApiSelect dataService={dataService} />);

    await userEvent.click(screen.getByRole('combobox'));

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
  });

  test('turns on `requestOnDidMount`', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

    render(<AweApiSelect defaultOpen requestOnDidMount dataService={dataService} />);

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
  });

  test('customized `fieldNames`', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: options }));

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

  test('handle `onSearch`', async () => {
    mockedAxios.get.mockImplementation((__, { params: { keyword } }) => {
      return Promise.resolve({
        data: options.filter(({ label }) =>
          String(label).toLowerCase().includes(String(keyword).toLowerCase())
        ),
      });
    });

    render(<AweApiSelect showSearch trigger="onSearch" dataService={searchDataService} />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    await screen.findByText('Hello');
    expect(screen.queryByText('React')).toBeNull();

    await userEvent.clear(screen.getByRole('textbox'));

    await screen.findByText('Hello');
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
      <AweApiSelect serviceQueries={['hello']} dataService={searchDataService} />
    );

    await userEvent.click(screen.getByRole('combobox'));
    await screen.findByText('Hello');
    expect(screen.queryByText('React')).toBeNull();

    rerender(<AweApiSelect serviceQueries={['react']} dataService={searchDataService} />);
    await screen.findByText('React');
    expect(screen.queryByText('Hello')).toBeNull();
  });
});

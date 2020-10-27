import React from 'react';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AweApiCascader from './..';
import { CascaderOptionType } from './../../cascader';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const dataService = async () => {
  const result = await axios.get<CascaderOptionType[]>('/api/mock/options');

  return result.data;
};

const childDataService = async (targetOption: CascaderOptionType) => {
  const result = await axios.get<CascaderOptionType[]>(
    '/api/mock/child-options',
    {
      params: { parentOptionLabel: targetOption.label }
    }
  );

  return result.data;
};

const options: CascaderOptionType[] = [
  { label: 'Hello', value: '1', isLeaf: false },
  { label: 'React', value: '2', isLeaf: false }
];

const childOptionsMap: { [K in 'Hello' | 'React']: CascaderOptionType[] } = {
  Hello: [
    { label: 'Child 1-1', value: '1-1' },
    { label: 'Child 1-2', value: '1-2' }
  ],
  React: [
    { label: 'Child 2-1', value: '2-1' },
    { label: 'Child 2-2', value: '2-2' }
  ]
};

describe('Testing <AweApiCascader />', () => {
  test('Fetches options on focus.', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: options })
    );

    render(<AweApiCascader dataService={dataService} />);

    // Here we click the outter <span> element
    // because focus event will be called twice if we click the inner <input> element.
    // But it should be and will be called only once if a real human click it.
    await userEvent.click(screen.getByRole('textbox').parentElement);

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('menuitem');
    expect(items).toHaveLength(2);
  });

  test('Fetches options on did mount.', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: options })
    );

    render(
      <AweApiCascader
        popupVisible
        trigger="onDidMount"
        dataService={dataService}
      />
    );

    await screen.findByText('Hello');
    await screen.findByText('React');

    const items = await screen.findAllByRole('menuitem');
    expect(items).toHaveLength(2);
  });

  test('Fetches child options.', async () => {
    mockedAxios.get.mockImplementation(
      (endpoint, { params: { parentOptionLabel } = {} } = {}) => {
        if (endpoint.includes('child-options')) {
          return Promise.resolve({ data: childOptionsMap[parentOptionLabel] });
        }

        return Promise.resolve({ data: options });
      }
    );

    render(
      <AweApiCascader
        dataService={dataService}
        childDataService={childDataService}
      />
    );

    await userEvent.click(screen.getByRole('textbox').parentElement);

    await screen.findByText('Hello');

    await userEvent.click(screen.getByText('Hello'));

    // loading icon added.
    await screen.findByLabelText('icon: redo');

    await screen.findByText('Child 1-1');
    await screen.findByText('Child 1-2');

    // loading icon removed.
    await expect(screen.queryByLabelText('icon: redo')).toBeNull();

    await userEvent.click(screen.getByText('React'));

    // loading icon added.
    await screen.findByLabelText('icon: redo');

    await screen.findByText('Child 2-1');
    await screen.findByText('Child 2-2');

    // loading icon removed.
    await expect(screen.queryByLabelText('icon: redo')).toBeNull();
  });
});

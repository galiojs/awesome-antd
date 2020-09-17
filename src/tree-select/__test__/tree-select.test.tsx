import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AweTreeSelect from './../';

describe('Testing <AweTreeSelect />', () => {
  test('`fieldNames` works as expected.', () => {
    render(
      <AweTreeSelect
        fieldNames={{
          title: 'name',
        }}
        treeData={[
          {
            name: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [
              {
                name: 'Child Node1',
                value: '0-0-1',
                key: '0-0-1',
              },
              {
                name: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2',
              },
            ],
          },
          {
            name: 'Node2',
            value: '0-1',
            key: '0-1',
          },
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('combobox'));

    expect(screen.getByText('Node1')).toBeInTheDocument();
    expect(screen.queryByText('Child Node1')).not.toBeInTheDocument();
  });
});

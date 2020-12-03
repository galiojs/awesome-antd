import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AweTag from '..';

describe('Testing <AweTagGroup />', () => {
  test('AweTagGroup onChange', async () => {
    const Demo = () => {
      const [checkedValues, setCheckedValues] = React.useState([]);

      return (
        <>
          <span>{checkedValues.join(',')}</span>
          <AweTag.Group
            options={[
              { label: 'A1-01', value: 'A1-01' },
              { label: 'A1-02', value: 'A1-02' }
            ]}
            value={checkedValues}
            onChange={setCheckedValues}
          />
        </>
      );
    };

    render(<Demo />);

    // click
    await userEvent.click(screen.getByText('A1-01'));
    await userEvent.click(screen.getByText('A1-02'));

    expect(screen.getByText('A1-01,A1-02')).toBeInTheDocument();
  });
});

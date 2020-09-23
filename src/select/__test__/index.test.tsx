import React from 'react';
import { render, screen } from '@testing-library/react';

import AweSelect from '..';

describe('Testing <AweSelect />', () => {
  test('rendered without errors.', () => {
    render(<AweSelect />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

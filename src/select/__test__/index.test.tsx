import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Select, { OptionProps } from '..';

const options: OptionProps[] = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
];

describe('Testing <AweSelect />', () => {
  test('Using JSX style to render options.', async () => {
    render(
      <Select>
        <Select.Option value="option-1">Option 1</Select.Option>
        <Select.Option value="option-2">Option 2</Select.Option>
      </Select>
    );

    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('Using `options` prop to render options.', async () => {
    render(<Select options={options} />);

    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('Local filtering by `option.label`.', async () => {
    render(<Select showSearch options={options} />);

    const select = screen.getByRole('combobox');

    await userEvent.click(select);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    const input = select.querySelector('.ant-select-search__field');

    // Note that in the filter procedure,
    // the whitespaces will be trimmed before the matching,
    // and it's case insensitive.
    await userEvent.type(input, '   option 2   ');

    expect(screen.queryByText('Option 1')).toBeNull();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});

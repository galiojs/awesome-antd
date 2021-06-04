import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Input from '..';

describe('Testing <AweInput />', () => {
  test('Show the maximum length and count ,uncontrolled', () => {
    render(<Input maxLength={10} showLengthCount />);

    expect(screen.queryByText('5/10')).toBeNull();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(screen.queryByText('5/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count,have default value,uncontrolled ', async () => {
    render(<Input maxLength={10} showLengthCount defaultValue="我是默认的值！" />);

    expect(screen.queryByText('7/10')).toBeInTheDocument();

    // Restricted character
    await userEvent.type(screen.getByRole('textbox'), 'hellohello111111111');
    expect(screen.getByText('10/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count ,controlled', () => {
    render(<Input maxLength={5} showLengthCount value="值" />);

    expect(screen.queryByText('1/5')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(screen.queryByText('1/5')).toBeInTheDocument();
  });

  test('Show the count ,controlled', () => {
    render(<Input showLengthCount value="值" />);

    expect(screen.queryByText('1')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  test("Don't show the count ,controlled", () => {
    render(<Input value="值" />);

    expect(screen.queryByText('1')).toBeNull();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(screen.queryByText('1')).toBeNull();
  });

  test("Don't show the count ,uncontrolled", async () => {
    render(<Input showLengthCount />);

    expect(screen.queryByText('0')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), '12');
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('Show the maximum length and count ,value is undefined', () => {
    render(<Input value={undefined} maxLength={10} showLengthCount />);

    expect(screen.queryByText('0/10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(screen.queryByText('0/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count, controlled, TextArea', () => {
    render(<Input.TextArea value={undefined} maxLength={10} showLengthCount />);

    expect(screen.queryByText('0/10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(screen.queryByText('0/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count, beyond the control of length, uncontrolled, TextArea', async () => {
    render(<Input.TextArea maxLength={4} showLengthCount />);

    expect(screen.queryByText('0/4')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), 'hellohello111111111');
    expect(screen.getByText('4/4')).toBeInTheDocument();
  });

  test('The effect of `allowSearchOnClear` on `onSearch`', async () => {
    const txt = 'try to click on the clear icon';
    const searchHandler = jest.fn(() => {
      /* noop */
    });

    const { rerender } = render(
      <Input.Search allowClear allowSearchOnClear={false} onSearch={searchHandler} />
    );

    await userEvent.type(screen.getByRole('textbox'), txt);
    await userEvent.click(screen.getByLabelText('icon: search'));
    await userEvent.click(screen.getByLabelText('icon: close-circle'));

    expect(screen.getByRole('textbox')).toHaveAttribute('value', '');
    expect(searchHandler.mock.calls.length).toBe(1);

    rerender(<Input.Search allowClear allowSearchOnClear onSearch={searchHandler} />);

    await userEvent.type(screen.getByRole('textbox'), txt);
    await userEvent.click(screen.getByLabelText('icon: close-circle'));

    expect(screen.getByRole('textbox')).toHaveAttribute('value', '');
    expect(searchHandler.mock.calls.length).toBe(2);
  });
});

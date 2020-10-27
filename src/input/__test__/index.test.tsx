import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AweInput from '..';

describe('Testing <AweInput />', () => {
  test('Show the maximum length and count ,uncontrolled', () => {
    render(<AweInput maxLength={10} showLengthCount />);

    expect(screen.queryByText('5/10')).toBeNull();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('5/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count,have default value,uncontrolled ', () => {
    render(<AweInput maxLength={10} showLengthCount defaultValue="我是默认的值！" />);

    expect(screen.queryByText('7/10')).toBeInTheDocument();

    // Restricted character
    userEvent.type(screen.getByRole('textbox'), 'hellohello111111111');
    expect(screen.queryByText('10/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count ,controlled', () => {
    render(<AweInput maxLength={5} showLengthCount value="值" />);

    expect(screen.queryByText('1/5')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('1/5')).toBeInTheDocument();
  });

  test('Show the count ,controlled', () => {
    render(<AweInput showLengthCount value="值" />);

    expect(screen.queryByText('1')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  test("Don't show the count ,controlled", () => {
    render(<AweInput value="值" />);

    expect(screen.queryByText('1')).toBeNull();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('1')).toBeNull();
  });

  test("Don't show the count ,uncontrolled", () => {
    render(<AweInput showLengthCount />);

    expect(screen.queryByText('0')).toBeInTheDocument();
    userEvent.type(screen.getByRole('textbox'), '12');
    expect(screen.queryByText('2')).toBeInTheDocument();
  });

  test('Show the maximum length and count ,value is undefined', () => {
    render(<AweInput value={undefined} maxLength={10} showLengthCount />);

    expect(screen.queryByText('0/10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('0/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count ,value is undefined,  TextArea', async () => {
    render(<AweInput.TextArea value={undefined} maxLength={10} showLengthCount />);

    expect(screen.queryByText('0/10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('0/10')).toBeInTheDocument();
  });

  test('Show the maximum length and count ,  TextArea', async () => {
    render(<AweInput.TextArea value={undefined} maxLength={10} showLengthCount />);

    expect(screen.queryByText('0/10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('0/10')).toBeInTheDocument();
  });

  test('TextArea', async () => {
    render(<AweInput.TextArea value="4" />);

    expect(screen.queryByText('4')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' }
    });
    expect(screen.queryByText('hello')).toBeNull();
  });
});

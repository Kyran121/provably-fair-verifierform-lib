import type { Control } from '$lib/verifier/types';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ControlForTest from './InputForTest.svelte';

describe('Input Component', () => {
  it('renders a text input when control.type is "text"', async () => {
    const control: Control = {
      id: 'username',
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      attrs: { placeholder: 'Enter username' }
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText(/Username\*/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('placeholder', 'Enter username');

    await user.type(input, 'john');
    expect(input).toHaveValue('john');
  });

  it('renders a text input when control.type is "text" (error)', async () => {
    const control: Control = {
      id: 'username',
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      attrs: { placeholder: 'Enter username' }
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control, error: 'Required' } });

    const input = screen.getByLabelText(/Username\*/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('placeholder', 'Enter username');
    expect(input).toHaveAccessibleErrorMessage('Required');

    await user.type(input, 'john');
    expect(input).toHaveValue('john');
  });

  it('renders a text input when control.type is "text" (disabled)', async () => {
    const control: Control = {
      id: 'username',
      name: 'username',
      label: 'Username',
      type: 'text',
      disabled: true,
      syncToUrl: true,
      attrs: { placeholder: 'Enter username' }
    };

    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText(/Username \(disabled\)/);
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it('renders a number input when control.type is "number"', async () => {
    const control: Control = {
      id: 'age',
      name: 'age',
      label: 'Age',
      type: 'number',
      required: false,
      attrs: { min: 0, max: 120 }
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText('Age');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '120');
    expect(input).not.toHaveAttribute('required');
    expect(input).not.toHaveAccessibleErrorMessage();

    await user.type(input, '75');
    expect(input).toHaveValue(75);
  });

  it('renders a select input when control.type is "select"', async () => {
    const control: Control = {
      id: 'country',
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: ['uk', 'us']
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control, value: 'uk' } });

    const select = screen.getByLabelText(/Country\*/);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('uk');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('uk');
    expect(options[1]).toHaveTextContent('us');

    await user.selectOptions(select, 'us');
    expect(select).toHaveValue('us');
  });

  it('renders a select input when control.type is "select" (disabled)', async () => {
    const control: Control = {
      id: 'country',
      name: 'country',
      label: 'Country',
      type: 'select',
      disabled: true,
      options: ['uk', 'us']
    };

    render(ControlForTest, { props: { control, value: 'uk' } });

    const select = screen.getByLabelText(/Country \(disabled\)/);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('uk');
    expect(select).toBeDisabled();
  });
});

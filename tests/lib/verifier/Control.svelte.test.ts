import type { Control } from '$lib/verifier/types';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ControlForTest from './ControlForTest.svelte';

describe('Control Component', () => {
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
    expect(input).toHaveAccessibleErrorMessage('Required');

    await user.type(input, 'john');
    expect(input).toHaveValue('john');
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
      options: [
        { label: 'UK', value: 'uk' },
        { label: 'USA', value: 'us' }
      ]
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control, value: 'uk' } });

    const select = screen.getByLabelText(/Country\*/);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('uk');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('UK');
    expect(options[1]).toHaveTextContent('USA');

    await user.selectOptions(select, 'us');
    expect(select).toHaveValue('us');
  });
});

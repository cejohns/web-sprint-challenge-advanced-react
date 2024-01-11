import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppFunctional from './AppFunctional';

describe('AppFunctional Component', () => {
  test('renders the headings, buttons, and links', () => {
    render(<AppFunctional />);
    expect(screen.getByText(/coordinates/i)).toBeInTheDocument();
    expect(screen.getByText(/You moved/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /left/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /right/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /down/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('type email')).toBeInTheDocument();
  });

  test('typing in the email input changes its value', () => {
    render(<AppFunctional />);
    const emailInput = screen.getByPlaceholderText('type email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  // Additional tests can be added here
});
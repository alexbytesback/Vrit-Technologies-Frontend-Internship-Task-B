import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the Kanban board header', () => {
    render(<App />);
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
  });

  it('allows searching for tasks', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'test task' } });
    expect(searchInput).toHaveValue('test task');
  });

  it('shows add column button', () => {
    render(<App />);
    expect(screen.getByText('Add Column')).toBeInTheDocument();
  });

  it('allows adding a new column', () => {
    render(<App />);
    const addColumnButton = screen.getByText('Add Column');
    fireEvent.click(addColumnButton);
    
    const input = screen.getByPlaceholderText('Enter column title...');
    fireEvent.change(input, { target: { value: 'New Column' } });
    
    const submitButton = screen.getByRole('button', { name: /add column/i });
    fireEvent.click(submitButton);
  });
});
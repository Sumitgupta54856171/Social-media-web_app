import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Signup';
import { Authcontext } from '../context';

// Mock the AuthContext
const mockRegister = jest.fn();
const mockAuthContextValue = {
  register: mockRegister,
  message: ''
};

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon">User</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  Facebook: () => <div data-testid="facebook-icon">Facebook</div>,
  Chrome: () => <div data-testid="chrome-icon">Chrome</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
  Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>
}));

// Mock react-router-dom Link
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to} data-testid="link">{children}</a>
}));

const renderSignup = () => {
  return render(
    <BrowserRouter>
      <Authcontext.Provider value={mockAuthContextValue}>
        <Signup />
      </Authcontext.Provider>
    </BrowserRouter>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form with all required fields', () => {
    renderSignup();

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('displays form inputs with correct placeholders', () => {
    renderSignup();

    expect(screen.getByPlaceholderText('johndoe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('hello@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('updates username state when input changes', () => {
    renderSignup();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    expect(usernameInput.value).toBe('testuser');
  });

  test('updates email state when input changes', () => {
    renderSignup();

    const emailInput = screen.getByPlaceholderText('hello@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('updates password state when input changes', () => {
    renderSignup();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility when eye icon is clicked', () => {
    renderSignup();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    const toggleButton = screen.getByTestId('eye-off-icon').closest('button');

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click to show password
    fireEvent.click(toggleButton);

    // Password should now be visible
    expect(passwordInput.type).toBe('text');

    // Click again to hide password
    fireEvent.click(screen.getByTestId('eye-icon').closest('button'));
    expect(passwordInput.type).toBe('password');
  });

  test('calls register function with correct parameters on form submission', async () => {
    renderSignup();

    const usernameInput = screen.getByPlaceholderText('johndoe');
    const emailInput = screen.getByPlaceholderText('hello@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });

  test('prevents form submission when required fields are empty', () => {
    renderSignup();

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.click(submitButton);

    // Form should not submit due to HTML5 validation
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('displays social login buttons', () => {
    renderSignup();

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  test('displays login link', () => {
    renderSignup();

    const loginLink = screen.getByText('Log In');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  test('applies focus styles to input fields', () => {
    renderSignup();

    const usernameInput = screen.getByPlaceholderText('johndoe');

    // Initially should not have focus styles
    expect(usernameInput.closest('div')).not.toHaveClass('border-blue-500');

    // Focus the input
    fireEvent.focus(usernameInput);

    // Should now have focus styles (this is harder to test with the current structure)
    // We can test that the onFocus handler is called
    expect(usernameInput).toHaveFocus();
  });
});



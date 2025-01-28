import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProvider } from '../../context/UserProvider';
import LoginForm from '../LoginForm';
import axios from 'axios';

// Mock axios request to simulate a real login process
jest.mock('axios');

describe('LoginForm Component', () => {
  test('renders LoginForm without crashing', () => {
    render(
      <UserProvider>
        <LoginForm />
      </UserProvider>
    );
    const loginHeading = screen.getByText(/Login in SAHEM/i);
    expect(loginHeading).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', () => {
    render(
      <UserProvider>
        <LoginForm />
      </UserProvider>
    );
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: 'ibraheem_zak@hotmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('ibraheem_zak@hotmail.com');
    expect(passwordInput.value).toBe('123456');
  });

  test('calls login API with correct credentials and logs user in', async () => {
    const mockLoginResponse = {
      data: {
        token: 'mock-jwt-token',
        user: {
          email: 'ibraheem_zak@hotmail.com',
          name: 'Ibraheem Zak',
          role: 'user',
        },
      },
    };

    // Mock axios POST request for login
    axios.post.mockResolvedValueOnce(mockLoginResponse);

    render(
      <UserProvider>
        <LoginForm />
      </UserProvider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Simulate user typing valid inputs
    fireEvent.change(emailInput, { target: { value: 'ibraheem_zak@hotmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Wait for the login API to be called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/login', // Replace with your actual login endpoint
        { email: 'ibraheem_zak@hotmail.com', password: '123456' }
      );
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockLoginResponse.data.user));
    });
  });

  test('displays error message when invalid credentials are entered', async () => {
    const mockErrorResponse = {
      response: { data: { message: 'Invalid credentials' } },
    };

    // Mock axios POST request to return error for invalid credentials
    axios.post.mockRejectedValueOnce(mockErrorResponse);

    render(
      <UserProvider>
        <LoginForm />
      </UserProvider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Simulate user typing invalid credentials
    fireEvent.change(emailInput, { target: { value: 'ibraheem_zak@hotmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Wait for error message
    await waitFor(() => {
      const errorMessage = screen.getByText(/Invalid credentials/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

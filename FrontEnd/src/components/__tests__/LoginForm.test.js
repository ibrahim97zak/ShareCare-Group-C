import { render, screen } from '@testing-library/react';
import { UserProvider } from '../context/UserProvider';
import LoginForm from '../LoginForm';

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
});

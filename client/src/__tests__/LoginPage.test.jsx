import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../pages/auth/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

test('renders login form and allows input', () => {
  const authValue = { login: jest.fn(), isAuthenticated: false };

  render(
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  expect(screen.getByRole('heading', { name: /institute admin login/i })).toBeInTheDocument();
  const email = screen.getByPlaceholderText(/admin@example.com/i);
  const password = screen.getByPlaceholderText(/enter password/i);

  fireEvent.change(email, { target: { value: 'test@example.com' } });
  fireEvent.change(password, { target: { value: 'Secret123' } });

  expect(email).toHaveValue('test@example.com');
  expect(password).toHaveValue('Secret123');
});

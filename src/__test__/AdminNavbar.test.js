import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../Providers/AuthContext';
import AdminNavbar from '../Components/AdminNavbar';

const mockLogout = jest.fn();

const renderComponent = (isAuthenticated = false, user = null) => {
  return render(
    <AuthProvider value={{ isAuthenticated, user, logout: mockLogout }}>
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('AdminNavbar', () => {
  
  it('toggles calculator dropdown', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/Calculator/i));

    expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Eligibility Loan Calculator/i)).toBeInTheDocument();
  });

});
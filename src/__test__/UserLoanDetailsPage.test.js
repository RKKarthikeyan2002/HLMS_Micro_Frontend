import React from 'react';
import { render, screen } from '@testing-library/react';
import UserLoanDetailsPage from '../Pages/UserLoanDetailsPage';

jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/MyApplicationDetailsView', () => () => <div>MyApplicationDetailsView</div>);

describe('UserLoanDetailsPage Component', () => {
    test('renders NavBar component', () => {
        render(<UserLoanDetailsPage />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders MyApplicationDetailsView component', () => {
        render(<UserLoanDetailsPage />);
        expect(screen.getByText('MyApplicationDetailsView')).toBeInTheDocument();
    });

    test('has correct structure', () => {
        const { container } = render(<UserLoanDetailsPage />);
        expect(container.firstChild).toHaveClass("flex flex-col min-h-screen bg-gray-100");
    });
});
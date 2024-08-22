import React from 'react';
import { render, screen } from '@testing-library/react';
import LoanApplication from '../Pages/LoanApplication';

jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/Steps2', () => () => <div>Steps2</div>);
jest.mock('../Components/Application', () => () => <div>Application</div>);

describe('LoanApplication Component', () => {
    test('renders NavBar component', () => {
        render(<LoanApplication />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders Steps2 component', () => {
        render(<LoanApplication />);
        expect(screen.getByText('Steps2')).toBeInTheDocument();
    });

    test('renders Application component', () => {
        render(<LoanApplication />);
        expect(screen.getByText('Application')).toBeInTheDocument();
    });

    test('has correct structure', () => {
        const { container } = render(<LoanApplication />);
        expect(container.firstChild).toHaveClass("d-flex flex-column min-vh-100 bg-light");
    });
});
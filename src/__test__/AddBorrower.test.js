// AddBorrower.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import AddBorrower from '../Pages/AddBorrower';

// Mock the child components
jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/Borrower', () => () => <div>Borrower</div>);
jest.mock('../Components/Steps', () => () => <div>Steps</div>);

describe('AddBorrower Component', () => {
    test('renders NavBar component', () => {
        render(<AddBorrower />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders Steps component', () => {
        render(<AddBorrower />);
        expect(screen.getByText('Steps')).toBeInTheDocument();
    });

    test('renders Borrower component', () => {
        render(<AddBorrower />);
        expect(screen.getByText('Borrower')).toBeInTheDocument();
    });

    test('has correct structure', () => {
        const { container } = render(<AddBorrower />);
        expect(container.firstChild).toHaveClass("d-flex flex-column min-vh-100 bg-light");
    });
});
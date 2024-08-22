import React from 'react';
import { render, screen } from '@testing-library/react';
import MyLoanDetails from '../Pages/MyLoanDetails'; 

jest.mock('../Components/NavBar', () => () => <div>NavBar Component</div>);
jest.mock('../Components/LoanDetails', () => () => <div>LoanDetails Component</div>);

describe('MyLoanDetails Component', () => {
    test('renders the NavBar component', () => {
        render(<MyLoanDetails />);
        expect(screen.getByText('NavBar Component')).toBeInTheDocument();
    });

    test('renders the LoanDetails component', () => {
        render(<MyLoanDetails />);
        expect(screen.getByText('LoanDetails Component')).toBeInTheDocument();
    });
});

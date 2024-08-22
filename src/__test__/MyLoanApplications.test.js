import React from 'react';
import { render, screen } from '@testing-library/react';
import MyLoanApplications from '../Pages/MyLoanApplications';

jest.mock('../Components/NavBar', () => () => <div>NavBar Component</div>);
jest.mock('../Components/MyApplications', () => () => <div>MyApplications Component</div>);

describe('MyLoanApplications Component', () => {
    test('renders the NavBar component', () => {
        render(<MyLoanApplications />);
        expect(screen.getByText('NavBar Component')).toBeInTheDocument();
    });
});

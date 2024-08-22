import React from 'react';
import { render, screen } from '@testing-library/react';
import MyHomeLoanAgreement from '../Pages/MyHomeLoanAggrement';

jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/HomeLoanAggrement', () => () => <div>HomeLoanAgreement</div>);

describe('MyHomeLoanAgreement Component', () => {
    test('renders NavBar component', () => {
        render(<MyHomeLoanAgreement />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders HomeLoanAgreement component', () => {
        render(<MyHomeLoanAgreement />);
        expect(screen.getByText('HomeLoanAgreement')).toBeInTheDocument();
    });

    test('has correct structure', () => {
        const { container } = render(<MyHomeLoanAgreement />);
        expect(container.firstChild).toHaveClass("flex flex-col h-screen");
    });
});
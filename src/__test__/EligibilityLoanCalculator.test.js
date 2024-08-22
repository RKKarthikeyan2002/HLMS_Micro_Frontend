import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EligibilityLoanCalculator from '../Pages/EligibilityLoanCalculator';

describe('EligibilityLoanCalculator Component', () => {
    test('renders the component correctly', () => {
        render(<EligibilityLoanCalculator />);
        expect(screen.getByText('Eligibility Loan Calculator')).toBeInTheDocument();
        expect(screen.getByLabelText(/Monthly Income/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Existing Debts/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Loan Tenure/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Annual Interest Rate/i)).toBeInTheDocument();
    });

    test('shows error message for invalid monthly income', () => {
        render(<EligibilityLoanCalculator />);
        fireEvent.change(screen.getByLabelText(/Monthly Income/i), { target: { value: '-1000' } });
        fireEvent.click(screen.getByText(/Calculate/i));
        expect(screen.getByText(/Monthly income must be greater than 0/i)).toBeInTheDocument();
    });

    test('shows error message for negative existing debts', () => {
        render(<EligibilityLoanCalculator />);
        fireEvent.change(screen.getByLabelText(/Monthly Income/i), { target: { value: '2000' } });
        fireEvent.change(screen.getByLabelText(/Existing Debts/i), { target: { value: '-500' } });
        fireEvent.click(screen.getByText(/Calculate/i));
        expect(screen.getByText(/Existing debts cannot be negative/i)).toBeInTheDocument();
    });

    test('shows error message for loan tenure less than 36', () => {
        render(<EligibilityLoanCalculator />);
        fireEvent.change(screen.getByLabelText(/Monthly Income/i), { target: { value: '2000' } });
        fireEvent.change(screen.getByLabelText(/Existing Debts/i), { target: { value: '500' } });
        fireEvent.change(screen.getByLabelText(/Loan Tenure/i), { target: { value: '24' } });
        fireEvent.click(screen.getByText(/Calculate/i));
        expect(screen.getByText(/Loan tenure must be at least 36 months/i)).toBeInTheDocument();
    });

    test('shows error message for interest rate less than 7%', () => {
        render(<EligibilityLoanCalculator />);
        fireEvent.change(screen.getByLabelText(/Monthly Income/i), { target: { value: '2000' } });
        fireEvent.change(screen.getByLabelText(/Existing Debts/i), { target: { value: '500' } });
        fireEvent.change(screen.getByLabelText(/Loan Tenure/i), { target: { value: '36' } });
        fireEvent.change(screen.getByLabelText(/Annual Interest Rate/i), { target: { value: '5' } });
        fireEvent.click(screen.getByText(/Calculate/i));
        expect(screen.getByText(/Interest rate must be at least 7%/i)).toBeInTheDocument();
    });
});
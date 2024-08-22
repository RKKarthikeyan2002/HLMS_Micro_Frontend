import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmiCalculator from '../Pages/EmiCalculator';

describe('EmiCalculator Component', () => {
    test('renders the component correctly', () => {
        render(<EmiCalculator />);
        expect(screen.getByText('EMI Calculator')).toBeInTheDocument();
        expect(screen.getByLabelText(/Loan Amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tenure/i)).toBeInTheDocument();
    });

    test('shows error message for loan amount less than ₹5,00,000', () => {
        render(<EmiCalculator />);
        fireEvent.change(screen.getByLabelText(/Loan Amount/i), { target: { value: '400000' } });
        fireEvent.click(screen.getByText(/Calculate EMI/i));
        expect(screen.getByText(/Loan amount must be at least ₹5,00,000/i)).toBeInTheDocument();
    });

    test('shows error message for interest rate less than 7%', () => {
        render(<EmiCalculator />);
        fireEvent.change(screen.getByLabelText(/Loan Amount/i), { target: { value: '600000' } });
        fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '5' } });
        fireEvent.click(screen.getByText(/Calculate EMI/i));
        expect(screen.getByText(/Interest rate must be at least 7%/i)).toBeInTheDocument();
    });

    test('shows error message for tenure less than 12 months', () => {
        render(<EmiCalculator />);
        fireEvent.change(screen.getByLabelText(/Loan Amount/i), { target: { value: '600000' } });
        fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '8' } });
        fireEvent.change(screen.getByLabelText(/Tenure/i), { target: { value: '6' } });
        fireEvent.click(screen.getByText(/Calculate EMI/i));
        expect(screen.getByText(/Tenure must be at least 12 months/i)).toBeInTheDocument();
    });

    test('calculates EMI and shows results correctly', () => {
        render(<EmiCalculator />);
        fireEvent.change(screen.getByLabelText(/Loan Amount/i), { target: { value: '1000000' } });
        fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '8' } });
        fireEvent.change(screen.getByLabelText(/Tenure/i), { target: { value: '24' } });
        fireEvent.click(screen.getByText(/Calculate EMI/i));

        expect(screen.getByText(/EMI:/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Interest:/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Amount Payable:/i)).toBeInTheDocument();
    });
});
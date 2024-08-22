import React from 'react';
import { render, screen } from '@testing-library/react';
import AddCollatoral from '../Pages/AddCollatoral';

jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/CollatoralForm', () => () => <div>CollatoralForm</div>);

describe('AddCollatoral Component', () => {
    test('renders NavBar component', () => {
        render(<AddCollatoral />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders CollatoralForm component', () => {
        render(<AddCollatoral />);
        expect(screen.getByText('CollatoralForm')).toBeInTheDocument();
    });

    test('has correct initial structure', () => {
        const { container } = render(<AddCollatoral />);
        expect(container.firstChild).toHaveClass("flex flex-col h-screen");
    });
});
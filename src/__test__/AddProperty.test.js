import React from 'react';
import { render, screen } from '@testing-library/react';
import AddProperty from '../Pages/AddProperty';

jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/PropertyForm', () => () => <div>PropertyForm</div>);

describe('AddProperty Component', () => {
    test('renders NavBar component', () => {
        render(<AddProperty />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders PropertyForm component', () => {
        render(<AddProperty />);
        expect(screen.getByText('PropertyForm')).toBeInTheDocument();
    });

    test('has correct structure', () => {
        const { container } = render(<AddProperty />);
        expect(container.firstChild).toHaveClass("flex flex-col h-screen");
    });
});
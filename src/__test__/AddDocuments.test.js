import React from 'react';
import { render, screen } from '@testing-library/react';
import AddDocuments from '../Pages/AddDocuments';

jest.mock('../Components/NavBar', () => () => <div>NavBar</div>);
jest.mock('../Components/Steps3', () => () => <div>Steps3</div>);
jest.mock('../Components/Documents', () => () => <div>Documents</div>);

describe('AddDocuments Component', () => {
    test('renders NavBar component', () => {
        render(<AddDocuments />);
        expect(screen.getByText('NavBar')).toBeInTheDocument();
    });

    test('renders Steps3 component', () => {
        render(<AddDocuments />);
        expect(screen.getByText('Steps3')).toBeInTheDocument();
    });

    test('renders Documents component', () => {
        render(<AddDocuments />);
        expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    test('has correct structure', () => {
        const { container } = render(<AddDocuments />);
        expect(container.firstChild).toHaveClass("d-flex flex-column min-vh-100 bg-light");
    });
});
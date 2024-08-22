import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminHome from '../Pages/Admin/AdminHome';

jest.mock('../Components/AdminNavbar', () => () => <div>AdminNavbar Component</div>);
jest.mock('../Components/AdminMain', () => () => <div>AdminMain Component</div>);

describe('AdminHome Component', () => {
    test('renders the AdminNavbar component', () => {
        render(<AdminHome />);
        expect(screen.getByText('AdminNavbar Component')).toBeInTheDocument();
    });

    test('renders the AdminMain component inside motion.div', () => {
        render(<AdminHome />);
        expect(screen.getByText('AdminMain Component')).toBeInTheDocument();
        
        const motionDivs = screen.getAllByText('AdminMain Component').map(element => element.parentElement);
        expect(motionDivs).toHaveLength(1);
    });
});

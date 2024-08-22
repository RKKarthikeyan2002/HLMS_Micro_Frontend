import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminLoanDetailPage from '../Pages/Admin/AdminLoanDetailPage';

jest.mock('../Components/AdminNavbar', () => () => <div>AdminNavbar Component</div>);
jest.mock('../Components/AdminLoanDetailsView', () => () => <div>AdminLoanDetailsView Component</div>);

describe('AdminLoanDetailPage Component', () => {
    test('renders the AdminNavbar component', () => {
        render(<AdminLoanDetailPage />);
        expect(screen.getByText('AdminNavbar Component')).toBeInTheDocument();
    });

    test('renders the AdminLoanDetailsView component inside motion.div', () => {
        render(<AdminLoanDetailPage />);
        expect(screen.getByText('AdminLoanDetailsView Component')).toBeInTheDocument();
        const motionDivs = screen.getAllByText('AdminLoanDetailsView Component').map(element => element.parentElement);
        expect(motionDivs).toHaveLength(1);
    });
});

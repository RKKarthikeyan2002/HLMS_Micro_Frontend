import React from 'react';
import { render, screen } from '@testing-library/react';
import Steps2 from '../Components/Steps2';

describe('Steps Component', () => {
  beforeEach(() => {
    render(<Steps2 />);
  });

  it('renders all step items', () => {
    expect(screen.getByText('Borrower Details')).toBeInTheDocument();
    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });
});

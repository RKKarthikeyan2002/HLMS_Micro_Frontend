import React from 'react';
import { render, screen } from '@testing-library/react';
import Steps from '../Components/Steps';

describe('Steps Component', () => {
  beforeEach(() => {
    render(<Steps />);
  });

  it('renders all step items', () => {
    expect(screen.getByText('Borrower Details')).toBeInTheDocument();
    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });
});

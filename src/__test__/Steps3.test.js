import React from 'react';
import { render, screen } from '@testing-library/react';
import Steps3 from '../Components/Steps3';

describe('Steps Component', () => {
  beforeEach(() => {
    render(<Steps3 />);
  });

  it('renders all step items', () => {
    expect(screen.getByText('Borrower Details')).toBeInTheDocument();
    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });
});

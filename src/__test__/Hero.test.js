import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../Components/Hero';

describe('Hero Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
  });

  it('renders the hero section with text content', () => {
    expect(screen.getByText(/Build Your Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Exactly How You Want/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover the best solutions for your home/i)).toBeInTheDocument();
    expect(screen.getByText(/Rated 5 Stars by Our Customers/i)).toBeInTheDocument();
  });

  it('renders the apply now button', () => {
    // Check for the "Apply Now" button and its properties
    const applyButton = screen.getByRole('link', { name: /Apply Now/i });
    expect(applyButton).toBeInTheDocument();
    expect(applyButton).toHaveAttribute('href', '/addBorrower');
  });

  it('renders the home loan illustration image', () => {
    const image = screen.getByAltText(/Home Loan Illustration/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://cdni.iconscout.com/illustration/premium/thumb/home-loan-5329600-4470628.png');
  });
});

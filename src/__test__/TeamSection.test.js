import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamSection from '../Components/TeamSection';

describe('TeamSection Component', () => {
  beforeEach(() => {
    render(<TeamSection />);
  });

  it('renders a specific title', () => {
    expect(screen.getByText('Meet our team')).toBeInTheDocument();
  });
  it('renders a specific description', () => {
    expect(screen.getByText("Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy.")).toBeInTheDocument();
  });
});

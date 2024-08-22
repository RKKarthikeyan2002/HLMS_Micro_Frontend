import React from 'react';
import NavBar from '../Components/NavBar';
import Hero from '../Components/Hero';
import TeamSection from '../Components/TeamSection';
import { Container } from 'react-bootstrap';

function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <Hero />
      <Container>
        <TeamSection />
      </Container>
    </div>
  );
}

export default Home;

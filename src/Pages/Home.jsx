import React from 'react';
import NavBar from '../Components/NavBar';
import Hero from '../Components/Hero';
import TeamSection from '../Components/TeamSection';
import { Container } from 'react-bootstrap';
import Footer from '../Components/Footer';

function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <Hero />
      <Container>
        <TeamSection />
      </Container>
      <Footer />
    </div>
  );
}

export default Home;

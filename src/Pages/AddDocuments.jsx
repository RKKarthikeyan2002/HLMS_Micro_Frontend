import React from 'react';
import Documents from '../Components/Documents';
import NavBar from '../Components/NavBar';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap'; // For responsive layout
import Steps3 from '../Components/Steps3';

function AddDocuments() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavBar />
      <Container fluid className="flex-grow-1 py-4 px-3">
        <Row className="mb-4">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center"
            >
              <Card className="">
                <Card.Body>
                  <Steps3 />
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Card className="">
                <Card.Body>
                  <Documents />
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AddDocuments;

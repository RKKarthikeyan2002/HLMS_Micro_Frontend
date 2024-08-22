import React from 'react'
import NavBar from '../Components/NavBar'
import CollatoralForm from '../Components/CollatoralForm'
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

function AddCollatoral() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <Container fluid className="">
        <Row className="mb-6">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
            </motion.div>
          </Col>
        </Row>
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CollatoralForm />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AddCollatoral

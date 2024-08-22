import React from 'react'
import NavBar from '../Components/NavBar'
import HomeLoanAgreement from '../Components/HomeLoanAggrement'
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';

function MyHomeLoanAggrement() {
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
              <HomeLoanAgreement />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default MyHomeLoanAggrement

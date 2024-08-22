import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import AdminNavbar from '../../Components/AdminNavbar';
import UserFeedbacks from '../../Components/UserFeedbacks';

function AdminUserFeedbacks() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminNavbar />
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
              <div className="bg-white shadow-lg rounded-lg p-6">
                <UserFeedbacks />
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminUserFeedbacks

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { MdClear } from 'react-icons/md';
import { motion } from 'framer-motion';

function AdminMain() {
  const [allLoans, setAllLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      const token = sessionStorage.getItem("adminToken");
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/loanappli/all', { headers: { 'Authorization': `Bearer ${token}` } });
        setAllLoans(response.data);
        setFilteredLoans(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };

    fetchLoans();
  }, [navigate]);

  useEffect(() => {
    const handleSearch = () => {
      const lowercasedSearchValue = searchValue.toLowerCase();
      const lowercasedStatus = status.toLowerCase();
      const searchValueAsInt = parseInt(searchValue, 10);

      const filtered = allLoans.filter(loan =>
        (searchValue === '' || 
          (Number.isInteger(searchValueAsInt) && loan.id === searchValueAsInt) || 
          loan.borrower.name.toLowerCase().includes(lowercasedSearchValue)) &&
        (status === '' || loan.status.toLowerCase() === lowercasedStatus)
      );

      setFilteredLoans(filtered);
      setCurrentPage(1); // Reset to first page when searching
    };

    handleSearch();
  }, [searchValue, status, allLoans]);

  const handleLoanDetails = (loan) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/loan', { state: { loan } });
  };

  const handleClear = () => {
    setSearchValue('');
    setStatus('');
    setFilteredLoans(allLoans);
    setCurrentPage(1); // Reset to first page when clearing
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const indexOfLastLoan = currentPage * itemsPerPage;
  const indexOfFirstLoan = indexOfLastLoan - itemsPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-primary mb-4">All Loans</h2>

      <Row className="mb-4 align-items-center">
        <Col md={8} lg={9}>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by Loan ID or Borrower Name"
              value={searchValue}
              onChange={handleInputChange}
              className="me-2"
              style={{ borderRadius: '0.25rem', boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)' }}
            />
            <Form.Select
              value={status}
              onChange={handleStatusChange}
              aria-label="Select status"
              className="me-2"
              style={{ borderRadius: '0.25rem' }}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="rejected">Rejected</option>
              <option value="waiting agreement">Waiting Agreement</option>
              <option value="approved">Approved</option>
              <option value="accepted">Accepted</option>
            </Form.Select>
            <Button
              variant="outline-danger"
              onClick={handleClear}
              className="ms-2 rounded"
              style={{ borderRadius: '0.25rem' }}
            >
              <MdClear className="me-2" /> Clear
            </Button>
            <Button
              variant="outline-info"
              onClick={() => window.location.reload()}
              className="ms-2 rounded"
              style={{ borderRadius: '0.25rem' }}
            >
              <IoMdRefresh className="me-2" /> Refresh
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Table striped bordered hover responsive variant='light' className="shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>Loan ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Interest</th>
              <th>Term (Months)</th>
              <th>Status</th>
              <th>Borrower Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLoans.length > 0 ? (
              currentLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>₹ {loan.amount.toLocaleString()}</td>
                  <td>{loan.type}</td>
                  <td>{loan.interest}%</td>
                  <td>{loan.termMonths}</td>
                  <td className={`text-capitalize ${loan.status.toLowerCase()}`} style={{ textTransform: 'capitalize' }}>
                    {loan.status}
                  </td>
                  <td>{loan.borrower.name}</td>
                  <td>{loan.borrower.phone}</td>
                  <td>{loan.borrower.email}</td>
                  <td>
                    <Button 
                      variant="outline-info"
                      onClick={() => handleLoanDetails(loan)}
                      className='d-flex align-items-center'
                      style={{ borderRadius: '0.25rem' }}
                    >
                      <FaInfoCircle className="me-2" /> View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No loans found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </motion.div>

      <Row className="justify-content-center mt-4">
        <Col md="auto">
          <div className="d-flex justify-content-center">
            <Button 
              variant="outline-primary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="me-2"
              style={{ borderRadius: '0.25rem' }}
            >
              Previous
            </Button>
            <span className="my-auto">{currentPage} / {totalPages}</span>
            <Button 
              variant="outline-primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ms-2"
              style={{ borderRadius: '0.25rem' }}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminMain;

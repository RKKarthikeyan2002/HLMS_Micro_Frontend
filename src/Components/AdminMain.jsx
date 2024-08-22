import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { MdClear } from 'react-icons/md';

function AdminMain() {
  const [allLoans, setAllLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    loanId: '',
    borrowerName: '',
    status: ''
  });
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

  const handleLoanDetails = (loan) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/loan', { state: { loan } });
  };

  const handleSearch = () => {
    const { loanId, borrowerName, status } = searchCriteria;
    const lowercasedLoanId = parseInt(loanId, 10);
    const lowercasedBorrowerName = borrowerName.toLowerCase();
    const lowercasedStatus = status.toLowerCase();

    const filtered = allLoans.filter(loan =>
      (loanId === '' || loan.id === lowercasedLoanId) &&
      (borrowerName === '' || loan.borrower.name.toLowerCase().includes(lowercasedBorrowerName)) &&
      (status === '' || loan.status.toLowerCase() === lowercasedStatus)
    );
    setFilteredLoans(filtered);
  };

  const handleClear = () => {
    setSearchCriteria({ loanId: '', borrowerName: '', status: '' });
    setFilteredLoans(allLoans);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prevCriteria => ({
      ...prevCriteria,
      [name]: value
    }));
  };

  return (
    <Container className="mt-4">
      <h2 className="text-primary mb-4">All Loans</h2>

      <Row className="mb-4 align-items-center">
    <Col md={8} lg={9}>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Loan ID"
          name="loanId"
          value={searchCriteria.loanId}
          onChange={handleInputChange}
        />
        <Form.Control
          type="text"
          placeholder="Search by Borrower Name"
          name="borrowerName"
          value={searchCriteria.borrowerName}
          onChange={handleInputChange}
        />
        <Form.Select
          name="status"
          value={searchCriteria.status}
          onChange={handleInputChange}
          aria-label="Select status"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="rejected">Rejected</option>
          <option value="waiting agreement">waiting agreement</option>
          <option value="approved">Approved</option>
          <option value="accepted">Accepted</option>
        </Form.Select>
        <Button 
          variant="primary" 
          onClick={handleSearch}
          className="ms-2 rounded"
        >
          <FaSearch className="me-2" /> Search
        </Button>
        <Button
          variant="outline-secondary"
          onClick={handleClear}
          className="ms-2 rounded"
        >
          <MdClear className="me-2" /> Clear
        </Button>
        <Button
          variant="outline-info"
          onClick={() => window.location.reload()}
          className="ms-2 rounded"
        >
          <IoMdRefresh className="me-2" /> Refresh
        </Button>
      </InputGroup>
    </Col>
  </Row>

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
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>₹ {loan.amount.toLocaleString()}</td>
                <td>{loan.type}</td>
                <td>{loan.interest}%</td>
                <td>{loan.termMonths}</td>
                <td className={`text-capitalize ${loan.status.toLowerCase()}`}>
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
    </Container>
  );
}

export default AdminMain;

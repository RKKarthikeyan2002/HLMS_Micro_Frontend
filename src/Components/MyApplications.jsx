import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyBillWave, FaUser, FaCalendarAlt, FaFilePdf, FaFileImage, FaUpload } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { motion } from 'framer-motion';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [property, setProperty] = useState(null);
  const [collaterals, setCollaterals] = useState([]);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate('/');
        return;
      }

      const decodedToken = jwtDecode(token);
      const { sub, id } = decodedToken;

      try {
        const [applicationsResponse, loansResponse] = await Promise.all([
          axios.get(`http://localhost:8080/loanappli/applications/${sub}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8080/loan/applications/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setApplications(applicationsResponse.data);
        setLoans(loansResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleViewDetails = (application) => {
    navigate("/myApplicationDetailsPage", { state: { application } })
    setSelectedApplication(application);

    axios.get(`http://localhost:8080/document/files/${application.id}`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
    .then(response => setDocuments(response.data))
    .catch(error => console.error('Error fetching documents:', error));

    axios.get(`http://localhost:8080/property/${application.id}`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
    .then(response => setProperty(response.data))
    .catch(error => console.error('Error fetching property:', error));

    axios.get(`http://localhost:8080/collateral/${application.id}`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
    .then(response => setCollaterals(response.data))
    .catch(error => console.error('Error fetching collaterals:', error));

    
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
    setDocuments([]);
    setProperty(null);
    setCollaterals([]);
  };

  const handleUploadPropertyDetails = (applicationId) => {
    navigate(`/addCollatoral/${applicationId}`);
  };

  const handleLoanDetails = (loan) => {
    navigate(`/loanDetails`, { state: { loan } });
  };

  const getFileIcon = (fileType) => {
    const extension = fileType.split('/').pop();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension)
      ? <FaFileImage style={{ fontSize: '1.5rem', color: '#007bff' }} />
      : <AiOutlineFilePdf style={{ fontSize: '1.5rem', color: '#dc3545' }} />;
  };

  const handleAgreement = (applicationId) => {
    navigate(`/agreement/${applicationId}`);
  };

  const getCardBorder = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'border-warning text-dark';
      case 'accepted':
        return 'border-primary text-dark'; 
      case 'processing':
        return 'border-primary text-dark'; 
      case 'waiting agreement':
        return 'border-primary text-dark'; 
      case 'rejected':
        return 'border-danger text-dark';
      default:
        return '';
    }
  };

  const getButtonColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning'; 
      case 'accepted':
        return 'primary'; 
      case 'processing':
        return 'primary'; 
      case 'waiting agreement':
        return 'primary';
      case 'rejected':
        return 'danger'; 
      default:
        return ''; 
    }
  };

  const getIconColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-warning'; 
      case 'accepted':
        return 'text-primary'; 
      case 'processing':
        return 'text-primary'; 
      case 'waiting agreement':
        return 'text-primary';
      case 'rejected':
        return 'text-danger';
      default:
        return '';
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-4"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Loan Applications</h1>
        <Row>
          {applications.map(application => (
            <Col md={4} key={application.id} className="mb-4">
              <Card className={`shadow-lg ${getCardBorder(application.status)}`}>
                <Card.Body>
                  <Card.Title>
                    <FaMoneyBillWave className={`${getIconColor(application.status)}`} /> Loan Amount: ₹ {application.amount ? application.amount.toLocaleString() : 'N/A'}
                  </Card.Title>
                  <Card.Text>
                    <strong>Type:</strong> {application.type || 'N/A'} <br />
                    <strong>Interest Rate:</strong> {application.interest || 'N/A'}% <br />
                    <strong>Term:</strong> {application.termMonths || 'N/A'} months <br />
                    <strong>Status:</strong> {application.status || 'N/A'}
                  </Card.Text>
                  <Button variant={`${getButtonColor(application.status)}`} onClick={() => handleViewDetails(application)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <h2 className="text-2xl font-bold text-gray-900 my-4">Loans</h2>
        <Row>
          {loans.map(loan => (
            <Col md={4} key={loan.id} className="mb-4">
              <Card className="shadow-lg border-success">
                <Card.Body>
                  <Card.Title><FaMoneyBillWave className="text-success" /> Loan Amount: ₹ {loan.amount ? loan.amount.toLocaleString() : 'N/A'}</Card.Title>
                  <Card.Text>
                    <strong>Type:</strong> {loan.type || 'N/A'} <br />
                    <strong>Interest Rate:</strong> {loan.interest || 'N/A'}% <br />
                    <strong>Term:</strong> {loan.termMonths || 'N/A'} months
                  </Card.Text>
                  <Button variant="success" onClick={() => handleLoanDetails(loan)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      {selectedApplication && (
        <Modal show={true} onHide={handleCloseDetails} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Loan Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h5 className="text-lg font-semibold">Loan Details</h5>
                <p><FaMoneyBillWave /> <strong>Amount:</strong> ₹ {selectedApplication.amount ? selectedApplication.amount.toLocaleString() : 'N/A'}</p>
                <p><FaCalendarAlt /> <strong>Type:</strong> {selectedApplication.type || 'N/A'}</p>
                <p><FaCalendarAlt /> <strong>Interest Rate:</strong> {selectedApplication.interest || 'N/A'}%</p>
                <p><FaCalendarAlt /> <strong>Term:</strong> {selectedApplication.termMonths || 'N/A'} months</p>
                <p><FaCalendarAlt /> <strong>Status:</strong> {selectedApplication.status || 'N/A'}</p>
              </Col>
              <Col md={6}>
                <h5 className="text-lg font-semibold">Borrower Details</h5>
                <p><FaUser /> <strong>Name:</strong> {selectedApplication.borrower?.name || 'N/A'}</p>
                <p><FaUser /> <strong>Email:</strong> {selectedApplication.borrower?.email || 'N/A'}</p>
                <p><FaUser /> <strong>Phone:</strong> {selectedApplication.borrower?.phone || 'N/A'}</p>
                <p><FaUser /> <strong>Age:</strong> {selectedApplication.borrower?.age || 'N/A'}</p>
                <p><FaCalendarAlt /> <strong>Date of Birth:</strong> {selectedApplication.borrower?.dob ? new Date(selectedApplication.borrower.dob).toLocaleDateString() : 'N/A'}</p>
                <p><FaUser /> <strong>Address:</strong> {selectedApplication.borrower?.address || 'N/A'}</p>
                <p><FaMoneyBillWave /> <strong>Salary:</strong> ₹ {selectedApplication.borrower?.salary ? selectedApplication.borrower.salary.toLocaleString() : 'N/A'}</p>
                <p><strong>Aadhar:</strong> {selectedApplication.borrower?.aadhar || 'N/A'}</p>
                <p><strong>PAN:</strong> {selectedApplication.borrower?.pan || 'N/A'}</p>
                <p><strong>Credit Score:</strong> {selectedApplication.borrower?.creditScore || 'N/A'}</p>
              </Col>
            </Row>

            <h5 className="mt-4 text-lg font-semibold">Documents</h5>
            <ListGroup>
              {documents.map(doc => (
                <ListGroup.Item key={doc.id} className="d-flex align-items-center">
                  <a href={`data:${doc.fileType};base64,${doc.data}`} download={doc.filename} className="text-decoration-none text-primary">
                    {getFileIcon(doc.fileType)} {doc.filename}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>

            {property && (
              <>
                <h5 className="mt-4 text-lg font-semibold">Property Details</h5>
                <ListGroup>
                  <ListGroup.Item><strong>Address:</strong> {property.address || 'N/A'}</ListGroup.Item>
                  <ListGroup.Item key={property.id} className="d-flex align-items-center">
                  <a href={`data:${property.fileType};base64,${property.data}`} download={property.filename} className="text-decoration-none text-primary">
                    {getFileIcon(property.fileType)} {property.filename}
                  </a>
                </ListGroup.Item>
                </ListGroup>
              </>
            )}

            {collaterals.length > 0 && (
              <>
                <h5 className="mt-4 text-lg font-semibold">Collaterals</h5>
                <ListGroup>
                  {collaterals.map(collateral => (
                    <ListGroup.Item key={collateral.id}>
                      <strong>Type:</strong> {collateral.type || 'N/A'} <br />
                      <strong>Description:</strong> {collateral.description || 'N/A'} <br />
                      <strong>Value:</strong> ₹ {collateral.value ? collateral.value.toLocaleString() : 'N/A'}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
          {selectedApplication.status.toLowerCase() === 'accepted' && (
            <Button variant="success" onClick={() => handleUploadPropertyDetails(selectedApplication.id)}>
              <FaUpload className="mr-2" /> Upload Property Details
            </Button>
          )}
          {selectedApplication.status.toLowerCase() === 'waiting agreement' && (
            <Button variant="primary" onClick={() => handleAgreement(selectedApplication.id)}>
              <FaFilePdf className="mr-2" /> Agreement
            </Button>
          )}
            <Button variant="secondary" onClick={handleCloseDetails}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default MyApplications;
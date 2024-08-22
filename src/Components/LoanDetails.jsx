import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFileImage, FaFilePdf } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';

function LoanDetails() {
  const [documents, setDocuments] = useState([]);
  const [property, setProperty] = useState(null);
  const [collaterals, setCollaterals] = useState([]);
  const location = useLocation();
  const { loan } = location.state || {};
  const navigate = useNavigate();

  const imageFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  const getFileIcon = (fileType) => {
    const extension = fileType.split('/').pop();
    return imageFileExtensions.includes(extension)
      ? <FaFileImage style={{ fontSize: '1.5rem', color: '#007bff' }} />
      : <AiOutlineFilePdf style={{ fontSize: '1.5rem', color: '#dc3545' }} />;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token || !loan) return;

    const fetchLoanDetails = async () => {
      try {
        const [documentsResponse, propertyResponse, collateralsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/document/files/${loan.loanApplication.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`http://localhost:8080/property/${loan.loanApplication.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get(`http://localhost:8080/collateral/${loan.loanApplication.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        setDocuments(documentsResponse.data || []);
        setProperty(propertyResponse.data || null);
        setCollaterals(collateralsResponse.data || []);
    
      } catch (error) {
        console.error('Error fetching loan details:', error);
      }
    };

    fetchLoanDetails();
  }, [loan]);

  if (!loan) return <div>Loading...</div>;

  const { amount, type, interest, termMonths, loanApplication } = loan;
  const { status, borrower } = loanApplication;
  const { name, email, phone, age, dob, address, salary, aadhar, pan, creditScore } = borrower;

  const handleAgreement = (application) => {
    navigate(`/agreement`, { state: { application } });
  };

  return (
    <Container>
      <h1 className="my-4">Loan Details</h1>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card className="loan-card">
            <Card.Body>
              <Card.Title>Loan Information</Card.Title>
              <Row className="details-row">
                <Col md={3}><strong>Amount:</strong></Col>
                <Col md={3}>₹ {amount.toLocaleString()}</Col>
                <Col md={3}><strong>Type:</strong></Col>
                <Col md={3}>{type}</Col>
              </Row>
              <Row className="details-row">
                <Col md={3}><strong>Interest Rate:</strong></Col>
                <Col md={3}>{interest}%</Col>
                <Col md={3}><strong>Term:</strong></Col>
                <Col md={3}>{termMonths} months</Col>
              </Row>
              <Row className="details-row">
                
                <Col md={3}><strong>Status:</strong></Col>
                <Col md={3}>{status}</Col>
                <Col md={3}><strong>EMI:</strong></Col>
                <Col md={3}>{Math.round(loan.loanApplication.amount / loan.loanApplication.termMonths)}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h2 className="my-4">Borrower Details</h2>
      <Row className="mb-4">
        <Col md={12}>
          <Card className="borrower-card">
            <Card.Body>
              <Card.Title>Borrower Information</Card.Title>
              <Row className="details-row">
                <Col md={3}><strong>Name:</strong></Col>
                <Col md={3}>{name}</Col>
                <Col md={3}><strong>Email:</strong></Col>
                <Col md={3}>{email}</Col>
              </Row>
              <Row className="details-row">
                <Col md={3}><strong>Phone:</strong></Col>
                <Col md={3}>{phone || 'N/A'}</Col>
                <Col md={3}><strong>Age:</strong></Col>
                <Col md={3}>{age}</Col>
              </Row>
              <Row className="details-row">
                <Col md={3}><strong>Date of Birth:</strong></Col>
                <Col md={3}>{new Date(dob).toLocaleDateString()}</Col>
                <Col md={3}><strong>Address:</strong></Col>
                <Col md={3}>{address}</Col>
              </Row>
              <Row className="details-row">
                <Col md={3}><strong>Salary:</strong></Col>
                <Col md={3}>₹ {salary.toLocaleString()}</Col>
                <Col md={3}><strong>Aadhar:</strong></Col>
                <Col md={3}>{aadhar}</Col>
              </Row>
              <Row className="details-row">
                <Col md={3}><strong>PAN:</strong></Col>
                <Col md={3}>{pan}</Col>
                <Col md={3}><strong>Credit Score:</strong></Col>
                <Col md={3}>{creditScore}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="my-4">Collateral Details</h2>
      <Row>
        <Col md={12}>
          {collaterals.length > 0 ? (
            <ListGroup>
              {collaterals.map((collateral, index) => (
                <ListGroup.Item key={index} className="mb-2">
                  <h5>{collateral.name}</h5>
                  <p><strong>Description:</strong> {collateral.description}</p>
                  <p><strong>Value:</strong> ₹ {collateral.value.toLocaleString()}</p>
                  <p><strong>Type:</strong> {collateral.type}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div>No collateral information available.</div>
          )}
        </Col>
      </Row>

      <h2 className="my-4">Uploaded Documents</h2>
      <Row>
        <Col md={12}>
          {documents.length > 0 ? (
            <ListGroup>
              {documents.map((doc, index) => (
                <ListGroup.Item key={index} className="mb-2">
                  <a
                    href={`data:${doc.fileType};base64,${doc.data}`}
                    download={doc.filename}
                    className="text-decoration-none text-primary"
                  >
                    {getFileIcon(doc.fileType)}
                    {doc.filename}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div>No documents uploaded.</div>
          )}
        </Col>
      </Row>

      <h2 className="my-4">Property Document</h2>
      {property && (
        <Card className="shadow-sm border-warning">
          <Card.Body>
            <h5>{property.filename}</h5>
            <a
              href={`data:${property.fileType};base64,${property.data}`}
              download={property.filename}
              className="text-decoration-none text-primary"
            >
              {getFileIcon(property.fileType)} {property.filename}
            </a>
          </Card.Body>
        </Card>
      )}
      {loan.loanApplication.status.toLowerCase() === 'approved' && (
          <Button variant="primary" onClick={() => handleAgreement(loan.loanApplication)}>
            <FaFilePdf className="mr-2" /> Agreement
          </Button>
        )}
    </Container>
  );
}

export default LoanDetails;

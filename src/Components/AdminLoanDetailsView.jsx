import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Alert, Spinner, ListGroup, Button } from 'react-bootstrap';
import { FaFileImage, FaUser, FaInfoCircle } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLoanDetailsView = () => {
  const { loanId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [property, setProperty] = useState(null);
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { loan } = location.state || {};

  const imageFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  const getFileIcon = (fileType) => {
    const extension = fileType.split('/').pop();
    return imageFileExtensions.includes(extension)
      ? <FaFileImage style={{ fontSize: '1.5rem', color: '#007bff' }} />
      : <AiOutlineFilePdf style={{ fontSize: '1.5rem', color: '#dc3545' }} />;
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
            setLoading(true);
            const token = sessionStorage.getItem("adminToken");
            if (!token) {
              navigate('/login');
              return;
            }
      
            try {
              const [documentsResponse] = await Promise.all([
                axios.get(`http://localhost:8080/document/files/${loan.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
              ]);
              setDocuments(documentsResponse.data || []);
              setError(null);
      
              if (loan.status.toLowerCase() !== 'pending' && loan.status.toLowerCase() !== 'accepted') {
                const [propertyResponse, collateralsResponse] = await Promise.all([
                  axios.get(`http://localhost:8080/property/${loan.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                  axios.get(`http://localhost:8080/collateral/${loan.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);
                setProperty(propertyResponse.data || null);
                setCollaterals(collateralsResponse.data || []);
              }
            } catch (error) {
              console.error('Error fetching loan details:', error);
              setError('Error fetching loan details. Please try again later.');
            } finally {
              setLoading(false);
            }
          };
      
          fetchLoanDetails();
  }, [loanId, navigate]);

  const handleStatusChange = async (status) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    if (status === 'Approved') {
        formData.append('status', 'waiting agreement');
    } else {
        formData.append('status', status);
    }

    try {
      await axios.patch(`http://localhost:8080/loanappli/application/${loan.id}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/adminHome")
    } catch (error) {
      console.error('Error updating loan status:', error);
      alert('Error updating loan status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  const { amount, type, interest, termMonths, borrower, status } = loan;
  const { name, email, phone, age, dob, address, salary, aadhar, pan, creditScore } = borrower;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Loan Details Report</h1>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-primary">
            <Card.Body>
              <Card.Title className="text-primary"><FaInfoCircle /> Loan Information</Card.Title>
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
                <Col md={9}>{status}</Col>
              </Row>
              {status.toLowerCase() === 'pending' && (
                <div className="mt-3">
                  <Button 
                    variant="success" 
                    className="mr-2" 
                    onClick={() => handleStatusChange('Accepted')}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleStatusChange('Rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
              {status.toLowerCase() === 'processing' && (
                <div className="mt-3">
                  <Button 
                    variant="success" 
                    className="mr-2" 
                    onClick={() => handleStatusChange('Approved')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleStatusChange('Rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="my-4">Borrower Details</h2>
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-secondary">
            <Card.Body>
              <Card.Title className="text-secondary"><FaUser /> Borrower Information</Card.Title>
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
    </div>
  );
};

export default AdminLoanDetailsView;

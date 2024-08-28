import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaUser, FaFilePdf, FaFileImage, FaUpload } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

function MyApplicationDetailsView() {
  const location = useLocation();
  const { application } = location.state || {};
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [property, setProperty] = useState(null);
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!application) {
      console.error('No loan application data available.');
      return;
    }

    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const [documentsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/document/files/${application.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        setDocuments(documentsResponse.data || []);
        setError(null);

        if (application.status.toLowerCase() !== 'pending' && application.status.toLowerCase() !== 'accepted') {
          const [propertyResponse, collateralsResponse] = await Promise.all([
            axios.get(`http://localhost:8080/property/${application.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
            axios.get(`http://localhost:8080/collateral/${application.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          ]);
          setProperty(propertyResponse.data || null);
          setCollaterals(collateralsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [application, navigate]);

  const handleUploadPropertyDetails = (applicationId) => {
    navigate(`/addCollatoral/${applicationId}`);
  };

  const handleAgreement = (application) => {
    navigate(`/agreement`, { state: { application } });
  };

  const getFileIcon = (fileType) => {
    const extension = fileType.split('/').pop();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension)
      ? <FaFileImage style={{ fontSize: '1.5rem', color: '#007bff' }} />
      : <AiOutlineFilePdf style={{ fontSize: '1.5rem', color: '#dc3545' }} />;
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

  if (!application) {
    return <p>Loading...</p>; 
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={12}>
          <Row>
            <Col md={6} className="mb-3">
              <Card className="shadow-sm border-primary w-100">
                <Card.Body>
                  <Card.Title className="text-primary"><FaMoneyBillWave /> Loan Details</Card.Title>
                  <Row>
                    <Col><strong>Amount:</strong> ₹ {application.amount ? application.amount.toLocaleString() : 'N/A'}</Col>
                    <Col><strong>Type:</strong> {application.type || 'N/A'}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Interest Rate:</strong> {application.interest || 'N/A'}%</Col>
                    <Col><strong>Term:</strong> {application.termMonths || 'N/A'} months</Col>
                  </Row>
                  <Row>
                    <Col><strong>Status:</strong> {application.status || 'N/A'}</Col>
                    <Col><strong>EMI:</strong> {Math.round(application.amount / application.termMonths)}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card className="shadow-sm border-secondary w-100">
                <Card.Body>
                  <Card.Title className="text-secondary"><FaUser /> Borrower Details</Card.Title>
                  <Row>
                    <Col><strong>Name:</strong> {application.borrower?.name || 'N/A'}</Col>
                    <Col><strong>Email:</strong> {application.borrower?.email || 'N/A'}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Phone:</strong> {application.borrower?.phone || 'N/A'}</Col>
                    <Col><strong>Age:</strong> {application.borrower?.age || 'N/A'}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Date of Birth:</strong> {application.borrower?.dob ? new Date(application.borrower.dob).toLocaleDateString() : 'N/A'}</Col>
                    <Col><strong>Address:</strong> {application.borrower?.address || 'N/A'}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Salary:</strong> ₹ {application.borrower?.salary ? application.borrower.salary.toLocaleString() : 'N/A'}</Col>
                    <Col><strong>Aadhar:</strong> {application.borrower?.aadhar || 'N/A'}</Col>
                  </Row>
                  <Row>
                    <Col><strong>PAN:</strong> {application.borrower?.pan || 'N/A'}</Col>
                    <Col><strong>Credit Score:</strong> {application.borrower?.creditScore || 'N/A'}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card className="shadow-sm border-info mb-3">
        <Card.Body>
          <Card.Title className="text-info"><FaFilePdf /> Documents</Card.Title>
          <ListGroup>
            {documents.map(doc => (
              <ListGroup.Item key={doc.id} className="d-flex align-items-center">
                <a href={`data:${doc.fileType};base64,${doc.data}`} download={doc.filename} className="text-decoration-none text-primary">
                  {getFileIcon(doc.fileType)} {doc.filename}
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {collaterals.length > 0 && (
        <Card className="shadow-sm border-success mb-3">
          <Card.Body>
            <Card.Title className="text-success">Collaterals</Card.Title>
            <ListGroup>
              {collaterals.map(collateral => (
                <ListGroup.Item key={collateral.id}>
                  <strong>Type:</strong> {collateral.type || 'N/A'} <br />
                  <strong>Value:</strong> ₹ {collateral.value ? collateral.value.toLocaleString() : 'N/A'}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {property && (
        <Card className="shadow-sm border-warning mb-3">
          <Card.Body>
            <Card.Title className="text-warning"><FaFilePdf /> Property Details</Card.Title>
            <ListGroup>
              <ListGroup.Item><strong>Address:</strong> {property.address || 'N/A'}</ListGroup.Item>
              <ListGroup.Item className="d-flex align-items-center">
                <a href={`data:${property.fileType};base64,${property.data}`} download={property.filename} className="text-decoration-none text-primary">
                  {getFileIcon(property.fileType)} {property.filename}
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      <div className="mt-4">
        {application.status.toLowerCase() === 'accepted' && (
          <Button variant="success" onClick={() => handleUploadPropertyDetails(application.id)}>
            <FaUpload className="mr-2" /> Upload Property Details
          </Button>
        )}
        {application.status.toLowerCase() === 'waiting agreement' && (
          <Button variant="primary" onClick={() => handleAgreement(application)}>
            <FaFilePdf className="mr-2" /> Agreement
          </Button>
        )}
        <Button variant="secondary" className="ml-2" onClick={() => navigate(-1)}>Close</Button>
      </div>
    </Container>
  );
}

export default MyApplicationDetailsView;

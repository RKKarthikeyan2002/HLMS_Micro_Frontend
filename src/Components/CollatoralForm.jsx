import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, Form, Row, Col, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDollarSign, faPlus, faArrowRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function CollateralForm() {
  const navigate = useNavigate();
  const { loanid } = useParams();
  
  const [loanDetails, setLoanDetails] = useState({});
  const [collateral, setCollateral] = useState({ type: '', value: '' });
  const [collaterals, setCollaterals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({ type: '', value: '' });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [loanResponse, docsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/loanappli/application/${loanid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8080/document/files/${loanid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setLoanDetails(loanResponse.data);
        setDocuments(docsResponse.data);
        
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, [navigate, loanid]);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleCollateralChange = (e) => {
    const { name, value } = e.target;
    setCollateral(prevCollateral => ({ ...prevCollateral, [name]: value }));
  };

  const validateCollateral = () => {
    const newErrors = {};
    if (!collateral.type) newErrors.type = 'Collateral type is required';
    if (!collateral.value) newErrors.value = 'Collateral value is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCollateral = () => {
    if (!validateCollateral()) return;

    setCollaterals([...collaterals, collateral]);
    handleModalClose();
    setCollateral({ type: '', value: '' });
  };

  const handleNext = () => {
    navigate("/uploadProperty", { state: { loanDetails, collaterals } });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary font-weight-bold">Loan Application Details</h2>
      
      <Row>
        <Col md={6}>
          <div className="mb-4">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> Borrower Details
            </h4>
            <p><strong>Name:</strong> {loanDetails.borrower?.name}</p>
            <p><strong>Email:</strong> {loanDetails.borrower?.email}</p>
            <p><strong>Phone:</strong> {loanDetails.borrower?.phone}</p>
          </div>

          <div className="mb-4">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faDollarSign} className="mr-2" /> Loan Details
            </h4>
            <p><strong>Amount:</strong> ₹ {loanDetails.amount?.toLocaleString()}</p>
            <p><strong>Type:</strong> {loanDetails.type}</p>
            <p><strong>Interest Rate:</strong> {loanDetails.interest}%</p>
            <p><strong>Term:</strong> {loanDetails.termMonths} months</p>
            <p><strong>Status:</strong> {loanDetails.status}</p>
          </div>
        </Col>

        <Col md={6}>
          <div className="mb-4">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Uploaded Documents
            </h4>
            <ListGroup>
              {documents.map(doc => (
                <ListGroup.Item key={doc.id} className="d-flex align-items-center">
                  <a href={`data:${doc.fileType};base64,${doc.data}`} download={doc.filename} className="text-decoration-none text-primary">
                    {doc.filename}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="mb-4">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Added Collaterals
            </h4>
            {collaterals.length === 0 ? (
              <p>No collaterals added yet.</p>
            ) : (
              <ListGroup>
                {collaterals.map((coll, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <span><strong>Type:</strong> {coll.type}, <strong>Value:</strong> ₹ {coll.value}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="primary" className="mr-2" onClick={handleModalShow}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Collateral
        </Button>

        <Button variant="success" onClick={handleNext}>
          <FontAwesomeIcon icon={faArrowRight} className="mr-2" /> Next
        </Button>
      </div>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Collateral</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="collateralType">
              <Form.Label>Collateral Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={collateral.type}
                onChange={handleCollateralChange}
                isInvalid={!!errors.type}
              />
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="collateralValue" className="mt-3">
              <Form.Label>Collateral Value</Form.Label>
              <Form.Control
                type="text"
                name="value"
                value={collateral.value}
                onChange={handleCollateralChange}
                isInvalid={!!errors.value}
              />
              <Form.Control.Feedback type="invalid">
                {errors.value}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCollateral}>
            Add Collateral
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CollateralForm;

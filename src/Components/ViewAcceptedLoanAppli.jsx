import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Form, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

function ViewApprovedLoanAppli() {
    const [property, setProperty] = useState(null);
    const [status, setStatus] = useState('');
    const { loanId } = useParams();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [collaterals, setCollaterals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('adminToken');
        if (!token) {
            navigate("/");
            return;
        }

        axios.get(`http://localhost:8080/property/${loanId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setProperty(response.data);
            setStatus(response.data.loanApplication.status);
            setLoading(false);
        })
        .catch(error => {
            setError('Error fetching property details.');
            setLoading(false);
        });

        axios.get(`http://localhost:8080/document/files/${loanId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setDocuments(response.data);
        })
        .catch(error => {
            setError('Error fetching documents.');
        });

        axios.get(`http://localhost:8080/collateral/${loanId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setCollaterals(response.data);
        })
        .catch(error => {
            setError('Error fetching collaterals.');
        });

    }, [loanId, navigate]);

    const handleStatusChange = async () => {
        const token = sessionStorage.getItem('adminToken');
        if (!token) return;

        const formData = new FormData();
        formData.append('status', status);

        try {
            await axios.patch(`http://localhost:8080/loanappli/application/${loanId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (status === 'Approved') {
                const loanData = {
                    amount: property.loanApplication.amount,
                    type: property.loanApplication.type,
                    interest: property.loanApplication.interest,
                    termMonths: property.loanApplication.termMonths,
                };

                await axios.post(`http://localhost:8080/loan/${loanId}`, loanData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            navigate("/adminHome");
        } catch (error) {
            setError('Error updating loan status.');
        }
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-center mt-4 text-danger">{error}</div>;
    if (!property) return <div className="text-center mt-4">No property details available.</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Loan Details</h2>
            <Row>
                <Col md={8}>
                    <Card className="shadow-lg rounded-lg border-0 mb-4 transition-transform transform hover:scale-105">
                        <Card.Body>
                            <Card.Title className="text-lg font-bold text-blue-600 mb-3">
                                Loan ID: {property.loanApplication.id}
                            </Card.Title>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Amount: <span className="font-semibold">${property.loanApplication.amount.toLocaleString()}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Type: <span className="font-semibold">{property.loanApplication.type}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Interest: <span className="font-semibold">{property.loanApplication.interest}%</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Term (Months): <span className="font-semibold">{property.loanApplication.termMonths}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Status: <span className={`font-semibold ${property.loanApplication.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                                    {property.loanApplication.status}
                                </span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Borrower Name: <span className="font-semibold">{property.loanApplication.borrower.name}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Borrower Phone: <span className="font-semibold">{property.loanApplication.borrower.phone}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Borrower Email: <span className="font-semibold">{property.loanApplication.borrower.email}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Borrower Address: <span className="font-semibold">{property.loanApplication.borrower.address}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Borrower Salary: <span className="font-semibold">${property.loanApplication.borrower.salary.toLocaleString()}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Aadhar: <span className="font-semibold">{property.loanApplication.borrower.aadhar}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                PAN: <span className="font-semibold">{property.loanApplication.borrower.pan}</span>
                            </Card.Text>
                            <Card.Text>
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                Credit Score: <span className="font-semibold">{property.loanApplication.borrower.creditScore}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-lg rounded-lg border-0 mb-4 transition-transform transform hover:scale-105">
                        <Card.Body>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Documents</h4>
                            <ListGroup>
                                {documents.map(doc => (
                                    <ListGroup.Item key={doc.id} className="hover:bg-gray-100 transition-all">
                                        <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                        <a
                                            href={`data:${doc.fileType};base64,${doc.data}`}
                                            download={doc.filename}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {doc.filename}
                                        </a>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-lg rounded-lg border-0 mb-4 transition-transform transform hover:scale-105">
                        <Card.Body>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Collateral Details</h4>
                            <ListGroup>
                                {collaterals.map(collateral => (
                                    <ListGroup.Item key={collateral.id} className="hover:bg-gray-100 transition-all">
                                        <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 me-2" />
                                        Collateral ID: {collateral.id} - <span className="font-semibold">{collateral.description}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-lg rounded-lg border-0 transition-transform transform hover:scale-105">
                        <Card.Body>
                            <Form.Group controlId="loanStatus">
                                <Form.Label className="text-lg font-semibold">Update Status</Form.Label>
                                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)} className="border-gray-300">
                                    <option value="">Select...</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" className="mt-3" onClick={handleStatusChange}>
                                <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Button variant="secondary" className="mt-3" onClick={() => window.history.back()}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
            </Button>
        </div>
    );
}

export default ViewApprovedLoanAppli;

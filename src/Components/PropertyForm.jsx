import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faFileUpload, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function PropertyForm() {
    const location = useLocation();
    const { loanDetails, collaterals } = location.state || {};
    const [address, setAddress] = useState('');
    const [propertyFile, setPropertyFile] = useState(null);
    const [itr, setFiles] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const allowedMimeType = 'application/pdf';

    const handleFileChange = (event, field) => {
        const file = event.target.files[0];
        if (file && file.type !== allowedMimeType) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: 'Only PDF files are allowed.'
            }));
            return;
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: ''
        }));

        if (field === 'propertyFile') {
            setPropertyFile(file);
        } else if (field === 'itr') {
            setFiles(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!propertyFile) newErrors.propertyFile = 'Property file is required';
        if (!itr) newErrors.itr = 'ITR file is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        formData.append('address', address);
        formData.append('propertyFile', propertyFile);
        formData.append('loanId', loanDetails.id);

        const itDoc = new FormData();
        itDoc.append('itrfile', itr);
        itDoc.append('loanId', loanDetails.id);

        try {
            await Promise.all(collaterals.map(async (collateral) => {
                if (collateral) {
                    await axios.post(`http://localhost:8080/collateral/${loanDetails.id}`, collateral, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                }
            }));

            await axios.post('http://localhost:8080/document/upload/irt', itDoc, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            await axios.post('http://localhost:8080/property/upload', formData, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setSuccessMessage("Application Submitted Successfully");
            setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Failed to upload files');
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="p-4 bg-light border rounded shadow-sm">
                        <h2 className="text-center text-primary mb-4">
                            <FontAwesomeIcon icon={faFileUpload} className="me-2" /> Upload Property and ITR Files
                        </h2>
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="address">
                                <Form.Label>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> Property Address
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter property address"
                                    required
                                    isInvalid={!!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="propertyFile" className="mt-3">
                                <Form.Label>
                                    <FontAwesomeIcon icon={faFileInvoice} className="me-2" /> Upload Property Document (pdf)
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event, 'propertyFile')}
                                    isInvalid={!!errors.propertyFile}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.propertyFile}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="itr" className="mt-3">
                                <Form.Label>
                                    <FontAwesomeIcon icon={faFileUpload} className="me-2" /> Upload IT Return (pdf)
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event, 'itr')}
                                    isInvalid={!!errors.itr}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.itr}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" variant="primary" className="mt-4 w-100">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default PropertyForm;

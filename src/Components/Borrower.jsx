import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

function Borrower() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        salary: '',
        dob: '',
        creditScore: '750',
        phone: '',
        age: '',
        aadhar: '',
        pan: '',
        customer: {}
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const updatedData = { ...prevData, [name]: value };
            if (name === 'dob') {
                updatedData.age = calculateAge(value);
            }
            return updatedData;
        });
        validateForm();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters long';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits long';
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (formData.age < 18 || formData.age > 60) {
            newErrors.age = 'Age must be between 18 and 60';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }

        if (!formData.salary) {
            newErrors.salary = 'Monthly Salary is required';
        } else if (formData.salary <= 4999) {
            newErrors.salary = 'Salary must be greater than 5000';
        }

        if (!formData.dob) {
            newErrors.dob = 'Date of Birth is required';
        }

        if (!formData.creditScore) {
            newErrors.creditScore = 'Credit Score is required';
        } else if (formData.creditScore < 300 || formData.creditScore > 850) {
            newErrors.creditScore = 'Credit Score must be between 300 and 850';
        }

        if (!formData.aadhar) {
            newErrors.aadhar = 'Aadhar Number is required';
        } else if (!/^\d{12}$/.test(formData.aadhar)) {
            newErrors.aadhar = 'Aadhar Number must be 12 digits long';
        }

        if (!formData.pan) {
            newErrors.pan = 'PAN Number is required';
        } else if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(formData.pan)) {
            newErrors.pan = 'PAN Number must be in the format XXXXX9999X';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8080/borrower/register', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                setAlertMessage('Borrower registered successfully');
                setShowAlert(true);
                navigate("/loanApplication", { state: { borrowerData: response.data } });
            } else {
                setAlertMessage('Error registering borrower');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Error registering borrower');
            setShowAlert(true);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        const { sub } = decodedToken;

        axios.get(`http://localhost:8080/customer/${sub}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => setFormData(prevData => ({
            ...prevData, 
            customer: response.data,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            dob: response.data.dob,
            age: calculateAge(response.data.dob),
            address: response.data.address,
        })))
        .catch(error => {
            console.error('Error fetching customer data:', error);
        });
    }, [navigate]);

    const calculateAge = (dob) => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-8">
                <div className="bg-white shadow-md rounded-md p-6">   
                    <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Borrower Details
                    </h2>
                    {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formPhone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        isInvalid={!!errors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formAge">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="age"
                                        value={formData.age || ''}
                                        onChange={handleChange}
                                        isInvalid={!!errors.age}
                                        readOnly
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.age}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formSalary">
                                    <Form.Label>Monthly Salary</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        isInvalid={!!errors.salary}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.salary}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formDob">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dob"
                                        value={formData.dob || ''}
                                        onChange={handleChange}
                                        isInvalid={!!errors.dob}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dob}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formAadhar">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="aadhar"
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                        isInvalid={!!errors.aadhar}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.aadhar}
                                    </Form.Control.Feedback>
                                </Form.Group>
    
                                <Form.Group controlId="formPan">
                                    <Form.Label>PAN Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pan"
                                        value={formData.pan}
                                        onChange={handleChange}
                                        isInvalid={!!errors.pan}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.pan}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
    
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Next
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Borrower;

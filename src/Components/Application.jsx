import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function Application() {
    const navigate = useNavigate();
    const location = useLocation();
    const { borrowerData } = location.state || {};

    const [formData, setFormData] = useState({
        amount: '',
        type: 'Home Loan',
        interest: '8.5',
        termMonths: '',
        status: 'pending',
        borrower: borrowerData || {}
    });

    const [errors, setErrors] = useState({
        amount: '',
        type: '',
        interest: '',
        termMonths: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.amount) newErrors.amount = 'Loan amount is required';
        if (formData.amount < 500000) newErrors.amount = 'Minimum Loan amount is 5 Lakhs';
        if (!formData.termMonths) newErrors.termMonths = 'Term in months is required';
        if (formData.termMonths < 36) newErrors.termMonths = 'Minimum Term months is 36';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('token');
        axios.post('http://localhost:8080/loanappli/apply', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (response.status === 200) {
                navigate("/addDocuments", { state: { applicationData: response.data } });
            } else {
                alert('Error submitting loan application');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting loan application');
        });
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }
        console.log(borrowerData)
    }, [navigate]);

    return (
        <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="w-full max-w-lg space-y-8">
                <div className="bg-white shadow-lg rounded-lg p-8 transform transition-transform duration-300 hover:scale-105">
                    <img className="mx-auto h-12 w-auto" src="https://floatui.com/logo-dark.svg" alt="Logo" />
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                        Loan Application
                    </h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex items-center space-x-2">
                            <FaDollarSign className="text-sky-600 text-2xl" />
                            <div className="flex-1">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Loan Amount</label>
                                <div className="mt-1">
                                    <input
                                        name="amount"
                                        type="number"
                                        min="0"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.amount ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'} focus:ring-sky-500 focus:border-sky-500 transition duration-300 ease-in-out`}
                                        placeholder="Enter the loan amount"
                                    />
                                    {errors.amount && <p className="text-red-600 text-sm mt-1 flex items-center space-x-1"><HiOutlineExclamationCircle className="text-red-600" /> <span>{errors.amount}</span></p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <AiOutlineHome className="text-sky-600 text-2xl" />
                            <div className="flex-1">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loan Type</label>
                                <div className="mt-1">
                                    <input
                                        name="type"
                                        type="text"
                                        value={formData.type}
                                        readOnly
                                        className="block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="text-sky-600 text-2xl" />
                            <div className="flex-1">
                                <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700">Term (months)</label>
                                <div className="mt-1">
                                    <input
                                        name="termMonths"
                                        type="number"
                                        min="1"
                                        value={formData.termMonths}
                                        onChange={handleChange}
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.termMonths ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'} focus:ring-sky-500 focus:border-sky-500 transition duration-300 ease-in-out`}
                                        placeholder="Enter the term in months"
                                    />
                                    {errors.termMonths && <p className="text-red-600 text-sm mt-1 flex items-center space-x-1"><HiOutlineExclamationCircle className="text-red-600" /> <span>{errors.termMonths}</span></p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Application;

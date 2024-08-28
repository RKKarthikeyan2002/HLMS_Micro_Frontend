import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFileUpload, FaIdCard, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ACCEPTED_FILE_TYPES = {
    aadhar: ['application/pdf'],
    pancard: ['application/pdf'],
    photo: ['image/jpeg', 'image/png'],
};

function Documents() {
    const location = useLocation();
    const { applicationData } = location.state || {};
    const navigate = useNavigate();

    const [files, setFiles] = useState({
        aadhar: null,
        pancard: null,
        photo: null,
    });

    const [errors, setErrors] = useState({
        aadhar: '',
        pancard: '',
        photo: '',
    });

    const handleFileChange = (event, field) => {
        const file = event.target.files[0];
        if (file) {
            if (!ACCEPTED_FILE_TYPES[field].includes(file.type)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [field]: `Invalid file type. Accepted types are: ${ACCEPTED_FILE_TYPES[field].join(', ')}`
                }));
                setFiles(prevFiles => ({ ...prevFiles, [field]: null }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
                setFiles(prevFiles => ({ ...prevFiles, [field]: file }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!files.aadhar) newErrors.aadhar = 'Aadhar card is required and must be a PDF';
        if (!files.pancard) newErrors.pancard = 'PAN card is required and must be a PDF';
        if (!files.photo) newErrors.photo = 'Photo is required and must be an image';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        if (files.aadhar) formData.append('aadhar', files.aadhar);
        if (files.pancard) formData.append('pancard', files.pancard);
        if (files.photo) formData.append('photo', files.photo);
        formData.append("appliid", applicationData.id);

        try {
            await axios.post('http://localhost:8080/document/upload', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await Swal.fire({
                title: "Application Submitted Successfully",
                icon: "success"
              });
            navigate("/");
        } catch (error) {
            console.error('Error uploading files:', error);
            Swal.fire({
                title: "Oops... Something Went wrong",
                icon: "error"
              });
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
        <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg space-y-8"
            >
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                        <FaFileUpload className="inline-block text-blue-600 mr-3" />
                        Upload Borrower's Documents
                    </h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {[
                            { id: 'aadhar', label: 'Aadhar Card (pdf)', icon: <FaIdCard className="text-gray-500" /> },
                            { id: 'pancard', label: 'PAN Card (pdf)', icon: <FaIdCard className="text-gray-500" /> },
                            { id: 'photo', label: 'Photo (jpge or png)', icon: <FaUser className="text-gray-500" /> }
                        ].map(({ id, label, icon }) => (
                            <div key={id}>
                                <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex items-center">
                                    <span className="mr-2">{icon}</span>
                                    {label}
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="file"
                                        id={id}
                                        onChange={(event) => handleFileChange(event, id)}
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors[id] ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'} focus:ring-sky-500 focus:border-sky-500`}
                                    />
                                    {errors[id] && <p className="text-red-600 text-sm mt-1">{errors[id]}</p>}
                                </div>
                            </div>
                        ))}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default Documents;

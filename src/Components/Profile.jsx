import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Profile() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        age: '',
        dob: '',
        password: '',
        role: '',
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate('/');
            return;
        }
        const decodedToken = jwtDecode(token);
        const { sub } = decodedToken;

        axios.get(`http://localhost:8080/customer/${sub}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            const customerData = response.data;
            setData(customerData);
            setFormData({
                id: customerData.id,
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone || '',
                address: customerData.address || '',
                age: calculateAge(customerData.dob),
                dob: customerData.dob || '',
                password: customerData.password,
                role: customerData.role,
            });
        })
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const newState = {
                ...prevState,
                [name]: value,
            };

            // Calculate age if dob changes
            if (name === 'dob') {
                newState.age = calculateAge(value);
            }

            return newState;
        });
    };

    const handleSave = () => {
        const token = sessionStorage.getItem("token");

        axios.put(`http://localhost:8080/customer/update`, formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setData(response.data);
            setIsModalOpen(false);
        })
        .catch(error => {
            console.error('Error updating customer data:', error);
        });
    };

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
            return false;
        }
        return true;
    };

    const handlePasswordChange = () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;
        const token = sessionStorage.getItem("token");
        
        if (!token) {
            navigate('/');
            return;
        }

        const decodedToken = jwtDecode(token);
        const { sub } = decodedToken;

        if (newPassword === oldPassword) {
            alert('Old password and New Password should not be same');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }        

        if (!validatePassword(newPassword)) {
            alert('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        const password = new FormData();
        password.append("newPassword", newPassword);
        password.append("oldPassword", oldPassword);

        axios.put(`http://localhost:8080/customer/update/${sub}/password`, password, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            console.log(response.data);
            
            alert('Password changed successfully');
            setIsChangePasswordOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        })
        .catch(error => {
            console.error('Error changing password:', error);
            alert('Error changing password');
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto my-5 p-5">
            <div className="md:flex no-wrap md:-mx-2">
                <div className="w-full md:w-3/12 md:mx-2">
                    <div className="bg-white p-3 shadow-sm rounded-sm">
                        <div className="flex justify-center">
                            <img
                                className="w-24 h-24 rounded-full"
                                src="https://via.placeholder.com/150"
                                alt="Profile"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <h2 className="text-xl font-semibold">{data.name}</h2>
                            <p className="text-gray-600">{data.email}</p>
                        </div>
                    </div>
                </div>
                
                <div className="w-full md:w-9/12 md:mx-2">
                    <div className="bg-white p-3 shadow-sm rounded-sm mb-4">
                        <h3 className="text-lg font-semibold">Profile Details</h3>
                        <div className="mt-4">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Name:</span>
                                <span>{data.name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Email:</span>
                                <span>{data.email}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Phone:</span>
                                <span>{data.phone || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Address:</span>
                                <span>{data.address || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Age:</span>
                                <span>{formData.age || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Date of Birth:</span>
                                <span>{formatDate(data.dob) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Password:</span>
                                <span>******</span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setIsChangePasswordOpen(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="dob">Date of Birth</label>
                                <input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isChangePasswordOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="oldPassword">Old Password</label>
                                <input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handlePasswordChange}
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;

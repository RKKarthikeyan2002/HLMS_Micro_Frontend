import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUser, FaStickyNote } from 'react-icons/fa';
import { motion } from 'framer-motion';

function UserFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = sessionStorage.getItem("adminToken");
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/contactus/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFeedbacks(response.data);
      } catch (err) {
        setError('Failed to fetch feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFeedback(null);
    setIsModalOpen(false);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="py-14 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <h3 className="text-indigo-600 font-semibold text-xl md:text-2xl mb-6">
          <FaStickyNote className="inline-block mr-2 text-2xl" />
          User Feedbacks
        </h3>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          {feedbacks.length === 0 ? (
            <p className="text-center text-gray-600">No feedbacks available.</p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full border-collapse">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Message</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map(feedback => (
                    <motion.tr
                      key={feedback.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-700">{feedback.id}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center">
                          <FaUser className="text-indigo-600 mr-2" />
                          {feedback.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center">
                          <FaEnvelope className="text-indigo-600 mr-2" />
                          {feedback.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{feedback.message}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openModal(feedback)}
                          className="text-indigo-600 hover:text-indigo-800 transition duration-150"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedFeedback && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Feedback Details</h2>
            <p><strong>ID:</strong> {selectedFeedback.id}</p>
            <p><strong>Name:</strong> {selectedFeedback.name}</p>
            <p><strong>Email:</strong> {selectedFeedback.email}</p>
            <p><strong>Message:</strong> {selectedFeedback.message}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-150"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default UserFeedbacks;

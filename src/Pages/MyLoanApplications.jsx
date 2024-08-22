import React from 'react';
import NavBar from '../Components/NavBar';
import MyApplications from '../Components/MyApplications';
import { motion } from 'framer-motion';

function MyLoanApplications() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MyApplications />
        </motion.div>
      </div>
    </div>
  );
}

export default MyLoanApplications;

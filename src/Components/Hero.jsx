import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { IoIosStar } from 'react-icons/io';

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-200 py-16 md:py-28">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col-reverse md:flex-row items-center">
        <div className="flex-1 space-y-6 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight"
          >
            Build Your Home <span className="text-indigo-600">Exactly How You Want</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-700 text-lg md:text-xl"
          >
            Discover the best solutions for your home with our tailor-made services. From start to finish, we ensure that every detail meets your needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-x-4"
          >
            <Link
              to="/addBorrower"
              className="flex items-center justify-center gap-x-3 py-3 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-indigo-500 active:bg-indigo-700"
            >
              Apply Now
              <FaArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-x-2 mt-4"
          >
            <IoIosStar className="text-yellow-500 w-6 h-6" />
            <span className="text-gray-600">Rated 5 Stars by Our Customers</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex-1 mt-12 md:mt-0"
        >
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/home-loan-5329600-4470628.png"
            alt="Home Loan Illustration"
            className="max-w-full rounded-lg shadow-lg transform transition-transform hover:scale-105"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

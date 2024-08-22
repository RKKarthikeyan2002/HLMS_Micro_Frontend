import React, { useState } from 'react';
import { FaDollarSign, FaCalendarAlt, FaPercentage, FaCheckCircle } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';

const EligibilityLoanCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [existingDebts, setExistingDebts] = useState('0');
  const [loanTenure, setLoanTenure] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [maxEmi, setMaxEmi] = useState(null);
  const [eligibleLoanAmount, setEligibleLoanAmount] = useState(null);
  const [emiForLoanAmount, setEmiForLoanAmount] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let valid = true;
    let errors = {};

    if (parseFloat(monthlyIncome) <= 0) {
      errors.monthlyIncome = 'Monthly income must be greater than 0';
      valid = false;
    }
    if (parseFloat(existingDebts) < 0) {
      errors.existingDebts = 'Existing debts cannot be negative';
      valid = false;
    }
    if (parseInt(loanTenure, 10) < 36) {
      errors.loanTenure = 'Loan tenure must be at least 36 months';
      valid = false;
    }
    if (parseFloat(interestRate) < 7) {
      errors.interestRate = 'Interest rate must be at least 7%';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const calculateLoanDetails = () => {
    if (!validateInputs()) return;

    const income = parseFloat(monthlyIncome);
    const debts = parseFloat(existingDebts);
    const tenure = parseInt(loanTenure, 10);
    const interest = parseFloat(interestRate);

    const maxEmiValue = (income * 0.4) - debts;

    const monthlyInterestRate = interest / 12 / 100;
    const factor = Math.pow(1 + monthlyInterestRate, tenure);
    const eligibleLoanAmountValue = maxEmiValue * (factor - 1) / (monthlyInterestRate * factor);
    const emiForLoanAmountValue = eligibleLoanAmountValue * monthlyInterestRate * factor / (factor - 1);

    setMaxEmi(maxEmiValue.toFixed(2));
    setEligibleLoanAmount(eligibleLoanAmountValue.toFixed(2));
    setEmiForLoanAmount(emiForLoanAmountValue.toFixed(2));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Eligibility Loan Calculator</h1>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <FaDollarSign className="text-2xl text-blue-500" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="monthlyIncome">Monthly Income</label>
            <input
              id="monthlyIncome"
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className={`w-full p-3 border ${errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              placeholder="Enter your monthly income"
            />
            {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.monthlyIncome}</span></p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaDollarSign className="text-2xl text-blue-500" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="existingDebts">Existing Debts</label>
            <input
              id="existingDebts"
              type="number"
              value={existingDebts}
              onChange={(e) => setExistingDebts(e.target.value)}
              className={`w-full p-3 border ${errors.existingDebts ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              placeholder="Enter your existing debts"
            />
            {errors.existingDebts && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.existingDebts}</span></p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-2xl text-blue-500" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="loanTenure">Loan Tenure (months)</label>
            <input
              id="loanTenure"
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              className={`w-full p-3 border ${errors.loanTenure ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              placeholder="Enter loan tenure in months"
            />
            {errors.loanTenure && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.loanTenure}</span></p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaPercentage className="text-2xl text-blue-500" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="interestRate">Annual Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={`w-full p-3 border ${errors.interestRate ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              placeholder="Enter annual interest rate"
            />
            {errors.interestRate && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.interestRate}</span></p>}
          </div>
        </div>

        <button
          onClick={calculateLoanDetails}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-300"
        >
          Calculate
        </button>

        {maxEmi !== null && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md animate__animated animate__fadeIn">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Results</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaCheckCircle className="text-green-500" />
                <p><strong>Maximum EMI you can afford:</strong> ₹{maxEmi}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaCheckCircle className="text-green-500" />
                <p><strong>Eligible Loan Amount:</strong> ₹{eligibleLoanAmount}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaCheckCircle className="text-green-500" />
                <p><strong>EMI for the Eligible Loan Amount:</strong> ₹{emiForLoanAmount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityLoanCalculator;

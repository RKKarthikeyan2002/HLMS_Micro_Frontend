import React, { useState } from 'react';
import { FaMoneyBillWave, FaPercent, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';

function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmountPayable, setTotalAmountPayable] = useState(null);
  
  const [errors, setErrors] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: '',
  });

  const validateInputs = () => {
    let valid = true;
    let errors = { loanAmount: '', interestRate: '', tenure: '' };

    if (parseFloat(loanAmount) < 500000) {
      errors.loanAmount = 'Loan amount must be at least ₹5,00,000';
      valid = false;
    }
    if (parseFloat(interestRate) < 7) {
      errors.interestRate = 'Interest rate must be at least 7%';
      valid = false;
    }
    if (parseInt(tenure, 10) < 12) {
      errors.tenure = 'Tenure must be at least 12 months';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const calculateEMI = () => {
    if (!validateInputs()) return;

    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseInt(tenure, 10);

    // EMI calculation
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = EMI * n;
    const totalInterest = totalPayment - P;

    // Round to nearest whole number
    setEmi(Math.round(EMI));
    setTotalAmountPayable(Math.round(totalPayment));
    setTotalInterest(Math.round(totalInterest));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-r from-green-50 via-green-100 to-green-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">EMI Calculator</h1>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <FaMoneyBillWave className="text-2xl text-green-600" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="loanAmount">Loan Amount</label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className={`w-full p-3 border ${errors.loanAmount ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300`}
              placeholder="Enter loan amount"
            />
            {errors.loanAmount && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.loanAmount}</span></p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaPercent className="text-2xl text-green-600" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="interestRate">Interest Rate (annual)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={`w-full p-3 border ${errors.interestRate ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300`}
              placeholder="Enter annual interest rate"
            />
            {errors.interestRate && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.interestRate}</span></p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-2xl text-green-600" />
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="tenure">Tenure (months)</label>
            <input
              id="tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className={`w-full p-3 border ${errors.tenure ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300`}
              placeholder="Enter tenure in months"
            />
            {errors.tenure && <p className="text-red-500 text-sm mt-1 flex items-center space-x-1"><IoMdCloseCircle className="text-red-500" /> <span>{errors.tenure}</span></p>}
          </div>
        </div>

        <button
          onClick={calculateEMI}
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 transition duration-300"
        >
          Calculate EMI
        </button>

        {emi !== null && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md animate__animated animate__fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Results</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaCheckCircle className="text-green-500" />
                <p><strong>EMI:</strong> ₹{emi}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaCheckCircle className="text-green-500" />
                <p><strong>Total Interest:</strong> ₹{totalInterest}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaCheckCircle className="text-green-500" />
                <p><strong>Total Amount Payable:</strong> ₹{totalAmountPayable}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmiCalculator;

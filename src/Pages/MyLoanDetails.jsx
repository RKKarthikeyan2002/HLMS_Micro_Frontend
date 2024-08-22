import React from 'react'
import NavBar from '../Components/NavBar'
import LoanDetails from '../Components/LoanDetails'

function MyLoanDetails() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 overflow-y-auto p-10"> {/* Adjust margin-top size as needed */}
        <LoanDetails />
      </div>
    </div>
  )
}

export default MyLoanDetails

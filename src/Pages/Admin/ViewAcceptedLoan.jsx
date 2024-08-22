import React from 'react'
import AdminNavbar from '../../Components/AdminNavbar'
import ViewApprovedLoanAppli from '../../Components/ViewAcceptedLoanAppli'

function ViewApprovedLoan() {
  return (
    <div>
      <AdminNavbar />
      <div className="flex-1 overflow-y-auto p-10"> {/* Adjust margin-top size as needed */}
        <ViewApprovedLoanAppli />
      </div>
    </div>
  )
}

export default ViewApprovedLoan

import React from 'react'
import ViewPendingLoanAppli from '../../Components/ViewPendingLoanAppli'
import AdminNavbar from '../../Components/AdminNavbar'

function ViewPendingLoan() {
  return (
    <div>
      <AdminNavbar />
      <div className="flex-1 overflow-y-auto p-10"> {/* Adjust margin-top size as needed */}
        <ViewPendingLoanAppli />
      </div>
    </div>
  )
}

export default ViewPendingLoan

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './NavBar';
import Login from './Login';
import SignUp from './SignUp';
import { AuthProvider } from '../Providers/AuthContext';
import Profile from './Profile';
import ContactUs from '../Pages/ContactUs';
import AddBorrower from '../Pages/AddBorrower';
import LoanApplication from '../Pages/LoanApplication';
import AddDocuments from '../Pages/AddDocuments';
import MyLoanApplications from '../Pages/MyLoanApplications';
import Home from '../Pages/Home';
import AddCollatoral from '../Pages/AddCollatoral';
import AddProperty from '../Pages/AddProperty';
import AdminHome from '../Pages/Admin/AdminHome';
import ViewPendingLoan from '../Pages/Admin/ViewPendingLoan';
import ViewApprovedLoan from '../Pages/Admin/ViewAcceptedLoan';
import MyLoanDetails from '../Pages/MyLoanDetails';
import EmiCalculator from '../Pages/EmiCalculator';
import EligibilityLoanCalculator from '../Pages/EligibilityLoanCalculator';
import AdminLoanDetailPage from '../Pages/Admin/AdminLoanDetailPage';
import UserLoanDetailsPage from '../Pages/UserLoanDetailsPage';
import MyHomeLoanAggrement from '../Pages/MyHomeLoanAggrement';
import AdminUserFeedbacks from '../Pages/Admin/AdminUserFeedbacks';
import AdminNavbar from './AdminNavbar';
import AdminProfile from './AdminProfile';

function AppRouter() {
  return (
    <div>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/" element={<> <Home /> </>} />
              
              <Route path="/login" element={<> <Login /> </>} />
              <Route path="/signup" element={<> <SignUp /> </>} />

              <Route path="/profile" element={<>  <NavBar /> <Profile /> </>} />
              <Route path="/feedbackForm" element={<>  <ContactUs /> </>} />
              <Route path="/emiCalculator" element={<>  <NavBar/> <EmiCalculator /> </>} />
              <Route path="/eligibilityCalculator" element={<>  <NavBar/> <EligibilityLoanCalculator /> </>} />

              <Route path="/addBorrower" element={<>  <AddBorrower /> </>} />
              <Route path="/loanApplication" element={<>  <LoanApplication /> </>} />
              <Route path="/addDocuments" element={<> <AddDocuments /> </>} />
              <Route path="/myApplication" element={<> <MyLoanApplications /> </>} />
              <Route path="/addCollatoral/:loanid" element={<> <AddCollatoral /> </>} />
              <Route path="/uploadProperty" element={<> <AddProperty /> </>} />
              <Route path="/loanDetails" element={<> <MyLoanDetails /> </>} />
              <Route path="/myApplicationDetailsPage" element={<UserLoanDetailsPage />} />
              <Route path="/agreement" element={<MyHomeLoanAggrement />} />

              <Route path="/loan" element={<AdminLoanDetailPage />} />

              <Route path="/adminHome" element={<> <AdminHome /> </>} />
              <Route path="/updatePendingLoan/:loanId" element={<> <ViewPendingLoan /> </>} />
              <Route path="/updateAcceptedLoan/:loanId" element={<> <ViewApprovedLoan /> </>} />
              <Route path="/feedbacks" element={<>  <AdminUserFeedbacks /> </>} />
              <Route path="/adminProfile" element={<>  <AdminNavbar /> <AdminProfile /> </>} />
            </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default AppRouter

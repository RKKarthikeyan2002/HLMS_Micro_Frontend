import React from 'react';
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomeLoanAgreement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { application } = location.state || {};

  // Check if the application has a status and it's approved
  const isApproved = application?.status === 'Approved';

  // Agreement details using application information
  const agreementDetails = {
    date: "August 20, 2024",
    lender: {
      name: "Karthikeyan R K",
      address: "123 Finance St",
      cityStateZip: "Financial City, FC 12345",
      contact: "123-456-7890",
    },
    borrower: {
      name: application?.borrower?.name || "Unknown",
      address: application?.borrower?.address || "Unknown",
      cityStateZip: application?.borrower?.address || "Unknown",
      contact: application?.borrower?.phone || "Unknown",
    },
    loanAmount: application?.amount || "0",
    numberOfInstallments: application?.termMonths || 0,
    disbursementDate: "30-08-2024",  // Assuming a fixed date or you can get this from the application if available
    interestRate: application?.interest || "0",
    installmentAmount: application.amount / 4,  // Assuming fixed installment amount or derive this from application
    firstInstallmentDate: "30-08-2024",  // Assuming a fixed date
    collateralDescription: "A mortgage on the property located at 789 Dream House Ave, Dreamtown, DT 54321",
    useOfLoan: "Purchasing a home",
    disbursementSchedule: [
      { installmentNumber: 1, amount: "500,000", date: "30-08-2024" },
      { installmentNumber: 2, amount: "500,000", date: "04-12-2024" },
      { installmentNumber: 3, amount: "500,000", date: "16-04-2025" },
      { installmentNumber: 4, amount: "500,000", date: "22-08-2025" },
    ],
    state: application?.borrower?.address || "Unknown",  // Adjust based on availability
  };

  const handleStatusChange = async (status) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('status', status);

    try {
      await axios.patch(`http://localhost:8080/loanappli/application/${application.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (status === 'Approved') {
        const loanData = {
          amount: application.amount,
          type: application.type,
          interest: application.interest,
          termMonths: application.termMonths,
        };

        await axios.post(`http://localhost:8080/loan/${application.id}`, loanData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      navigate("/");
    } catch (error) {
      console.error('Error updating loan status:', error);
      alert('Error updating loan status. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">Home Loan Agreement</Card.Header>
            <Card.Body>
              <Card.Title>Agreement Details</Card.Title>
              <Card.Text>
                <strong>Date:</strong> {agreementDetails.date}
              </Card.Text>

              <Row className="mb-4">
                <Col>
                  <Card.Subtitle className="mb-2 text-muted">Lender</Card.Subtitle>
                  <Card.Text>
                    <strong>Name:</strong> {agreementDetails.lender.name}<br />
                    <strong>Address:</strong> {agreementDetails.lender.address}<br />
                    <strong>City, State, ZIP:</strong> {agreementDetails.lender.cityStateZip}<br />
                    <strong>Contact:</strong> {agreementDetails.lender.contact}
                  </Card.Text>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Card.Subtitle className="mb-2 text-muted">Borrower</Card.Subtitle>
                  <Card.Text>
                    <strong>Name:</strong> {agreementDetails.borrower.name}<br />
                    <strong>Address:</strong> {agreementDetails.borrower.address}<br />
                    <strong>City, State, ZIP:</strong> {agreementDetails.borrower.cityStateZip}<br />
                    <strong>Contact:</strong> {agreementDetails.borrower.contact}
                  </Card.Text>
                </Col>
              </Row>

              <Card.Subtitle className="mb-2 text-muted">Loan Details</Card.Subtitle>
              <Card.Text>
                <strong>Loan Amount:</strong> ₹{agreementDetails.loanAmount}<br />
                <strong>Interest Rate:</strong> {agreementDetails.interestRate}%<br />
                <strong>Disbursement Date:</strong> {agreementDetails.disbursementDate}<br />
                <strong>Number of Installments:</strong> {agreementDetails.numberOfInstallments}<br />
                <strong>Installment Amount:</strong> ₹{agreementDetails.installmentAmount}<br />
                <strong>First Installment Date:</strong> {agreementDetails.firstInstallmentDate}<br />
                <strong>Use of Loan:</strong> {agreementDetails.useOfLoan}
              </Card.Text>

              <Row className="mb-4">
                <Col>
                  <Card.Subtitle className="mb-2 text-muted">Agreement Terms</Card.Subtitle>
                  <Card.Text>
                    1. Loan Amount and Disbursement<br/>
                    1.1 Loan Amount: The Lender agrees to loan the Borrower the principal sum of ₹{agreementDetails.loanAmount}, (the "Loan Amount").<br/>
                    1.2 Disbursement: The Loan Amount will be disbursed to the Borrower in {agreementDetails.numberOfInstallments} installments. The first installment will be made on {agreementDetails.disbursementDate}, and subsequent installments will be made as per the schedule outlined in Appendix A.<br/><br/>

                    2. Interest Rate and Repayment<br/>
                    2.1 Interest Rate: The Loan Amount will bear an annual interest rate of {agreementDetails.interestRate}% (the "Interest Rate").<br/>
                    2.2 Repayment Schedule: The Borrower agrees to repay the Loan Amount along with accrued interest in {agreementDetails.numberOfInstallments} monthly installments of ₹{agreementDetails.installmentAmount} each. The first installment is due on {agreementDetails.firstInstallmentDate}, and subsequent installments will be due on the same date of each subsequent month.<br/>
                    2.3 Prepayment: The Borrower may prepay the Loan Amount, in whole or in part, without penalty. Any prepayment will be applied to the principal balance.<br/><br/>

                    3. Security and Collateral<br/>
                    3.1 Security: As security for the repayment of the Loan Amount, the Borrower agrees to provide the following collateral: {agreementDetails.collateralDescription}.<br/>
                    3.2 Collateral Documentation: The Borrower will execute and deliver to the Lender any documents required to perfect the Lender’s security interest in the collateral.<br/><br/>

                    4. Use of Loan Proceeds<br/>
                    4.1 Purpose: The Borrower agrees to use the Loan Amount solely for the purpose of {agreementDetails.useOfLoan}.<br/><br/>

                    5. Covenants and Representations<br/>
                    5.1 Borrower’s Covenants: The Borrower agrees to maintain the collateral in good condition and to comply with all applicable laws and regulations.<br/>
                    5.2 Representations: The Borrower represents and warrants that all information provided to the Lender in connection with this Agreement is accurate and complete.<br/><br/>

                    6. Default and Remedies<br/>
                    6.1 Default: The Borrower will be considered in default under this Agreement if any of the following events occur: (i) failure to make any payment when due, (ii) failure to perform any obligation under this Agreement, or (iii) insolvency or bankruptcy.<br/>
                    6.2 Remedies: In the event of default, the Lender may declare the entire unpaid principal balance and accrued interest immediately due and payable, and may exercise all rights and remedies available under law or equity, including foreclosure on the collateral.<br/><br/>

                    7. Miscellaneous<br/>
                    7.1 Governing Law: This Agreement will be governed by and construed in accordance with the laws of {agreementDetails.state}.<br/>
                    7.2 Amendments: Any amendments to this Agreement must be made in writing and signed by both parties.<br/>
                    7.3 Notices: All notices under this Agreement must be in writing and delivered to the addresses listed above.<br/>
                    7.4 Severability: If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.<br/>
                    IN WITNESS WHEREOF, the parties have executed this Home Loan Agreement as of the date first above written.<br/>
                    Lender:
                  </Card.Text>
                </Col>
              </Row>

              <Card.Subtitle className="mb-2 text-muted">Disbursement Schedule</Card.Subtitle>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Installment Number</th>
                    <th>Amount (₹)</th>
                    <th>Disbursement Date</th>
                  </tr>
                </thead>
                <tbody>
                  {agreementDetails.disbursementSchedule.map((item, index) => (
                    <tr key={index}>
                      <td>{item.installmentNumber}</td>
                      <td>{application.amount / 4}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Card.Text className="mt-4">
                This Agreement is made and entered into as of {agreementDetails.date}.
              </Card.Text>

              {!isApproved && (
                <Form className="mt-4">
                  <Form.Group controlId="agreementOptions">
                    <Form.Label>Do you agree to the terms of the agreement?</Form.Label>
                    <div className="mt-3">
                      <Button 
                        variant="success" 
                        className="mr-2" 
                        onClick={() => handleStatusChange('Approved')}
                      >
                        Agree
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleStatusChange('Rejected')}
                      >
                        Not Agree
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              )}
              <strong>Name: </strong>{agreementDetails.borrower.name} {isApproved && "(Signed)"}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeLoanAgreement;

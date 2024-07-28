import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import Barcode from 'react-barcode';

const LoanTable = ({ loan }) => {

    
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="loan table">
        <TableHead>
          <TableRow>

            <TableCell>Student Name</TableCell>
            <TableCell>Book Name</TableCell>
            <TableCell>ISBN</TableCell>
            <TableCell>Issue Date</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{`${loan.user.first_name} ${loan.user.last_name}`}</TableCell>
            <TableCell>{loan.book.title}</TableCell>
            <TableCell>{<Barcode value={loan.book.isbn} width={1} height={30} />}</TableCell>
            <TableCell>{new Date(loan.loan_date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(loan.due_date).toLocaleDateString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoanTable;
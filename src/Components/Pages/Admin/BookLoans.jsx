import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from "../../Tables/DynamicTable";
import api from "../../../Utils/interceptor";
import {
  updateBookLoans,
  deleteBookLoans,
  getBooksLoans,
  checkBookLoanReturn,
} from "../../../Utils/endpoint";
import EditModal from "../../Modals/EditModal";
import CreateModal from "../../Modals/CreateModal";
import Grid from '@mui/material/Grid';
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { TextField, Typography } from "@mui/material";
import { useZxing } from "react-zxing";
import LoanTable from "../../Tables/LoanTable";

const BookLoans = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(5);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookLoanId, setBookLoanId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Scanner setup
  const { ref, torch, reset } = useZxing({
    onDecodeResult(result) {
      setBookLoanId(result.getText());
      setIsScanning(false);
    },
    paused: !isScanning,
  });

  // Main query for fetching book loans
  const { 
    data: loansData,
    isLoading: isLoansLoading,
    isError: isLoansError,
    error: loansError
  } = useQuery({
    queryKey: ['bookLoans', page, row, search],
    queryFn: async () => {
      const response = await api.get(getBooksLoans(), { 
        params: { page, row, search } 
      });

      const transformedData = response.data.data.map((item) => ({
        ...item,
        book: item.book ? item.book.title : "",
        user: item.user ? `${item.user.first_name} ${item.user.last_name}` : "",
        isbn: item.book ? item.book.isbn : "",
        status: calculateStatus(item),
      }));

      return {
        data: transformedData,
        total: response.data.total
      };
    },
  });

  // Query for checking book loan status
  const { 
    data: scanResult = { is_eligible: false, state: true },
    isLoading: isCheckingLoan,
    refetch: recheckLoan
  } = useQuery({
    queryKey: ['checkLoan', bookLoanId],
    queryFn: async () => {
      if (!bookLoanId) return { is_eligible: false, state: true };
      const response = await api.get(checkBookLoanReturn(bookLoanId));
      return response.data;
    },
    enabled: !!bookLoanId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newData) => api.post(getBooksLoans(), newData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookLoans']);
      setIsCreateModalOpen(false);
      Swal.fire({
        title: "Success!",
        text: "New Issue Book has been created.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join('\n');
        Swal.fire({
          title: "All copies occupied",
          text: errorMessage,
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to create Book Issue. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (editedData) => api.put(updateBookLoans(editedData.id), editedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookLoans']);
      setIsModalOpen(false);
      Swal.fire({
        title: "Success!",
        text: "Book has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      handleValidationError(error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(deleteBookLoans(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookLoans']);
      Swal.fire("Deleted!", "Book Issue has been deleted.", "success");
    },
    onError: () => {
      Swal.fire(
        "Error!",
        "There was a problem deleting the Book Issue.",
        "error"
      );
    },
  });

  // Return book mutation
  const returnBookMutation = useMutation({
    mutationFn: (id) => api.post(checkBookLoanReturn(id)),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['bookLoans']);
      queryClient.invalidateQueries(['checkLoan', bookLoanId]);
      Swal.fire("Returned!", response.data.message, "success");
      setBookLoanId('');
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        `Failed to return the book: ${error.message}`,
        "error"
      );
    },
  });

  // Helper functions
  const calculateStatus = (item) => {
    const currentDate = dayjs();
    const dueDate = dayjs(item.due_date);
    const loanDate = dayjs(item.loan_date);

    if (item.actual_return_date) return "Returned";
    if (currentDate.isAfter(dueDate)) return "Overdue";
    if (currentDate.isBefore(loanDate)) return "Scheduled";
    return "On Loan";
  };

  const handleValidationError = (error) => {
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const errorMessage = Object.values(validationErrors).flat().join('\n');
      Swal.fire({
        title: "All copies occupied",
        text: errorMessage,
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Failed to update Book Issue. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleReturn = () => {
    Swal.fire({
      title: 'Confirm Return',
      text: "Are you sure you want to return this book?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, return it!'
    }).then((result) => {
      if (result.isConfirmed) {
        returnBookMutation.mutate(bookLoanId);
      }
    });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const getTextFieldColor = () => {
    if (!scanResult) return 'primary';
    if (scanResult.state) return 'primary';
    return scanResult.is_eligible ? 'success' : 'error';
  };

  const createableColumns = ["user_id", "book_id", "due_date"];
  const editableColumns = ["user_id", "book_id", "due_date"];
  const tableHeader = [
    { headerName: "ID", align: "left", accessor: "id" },
    { headerName: "Borrower", align: "left", accessor: "user" },
    { headerName: "Book Name", align: "left", accessor: "book" },
    { headerName: "ISBN", align: "left", accessor: "isbn" },
    { headerName: "Issue Date", align: "left", accessor: "loan_date" },
    { headerName: "Due date", align: "left", accessor: "due_date" },
    { headerName: "Returned date", align: "left", accessor: "actual_return_date" },
    { headerName: "Status", align: "left", accessor: "status" },
  ];

  return (
    <>
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={4.5}>
          <Box sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
            <Button onClick={() => setIsScanning(!isScanning)} sx={{ marginLeft: 2 }}>
              {isScanning ? "Stop Scanning" : "Start Scanning"}
            </Button>

            {isScanning && (
              <Box sx={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingBottom: "75%",
                mb: 2,
              }}>
                <video
                  ref={ref}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
              <TextField
                fullWidth
                id="book-loan-id"
                label="Book Loan ID"
                value={bookLoanId}
                onChange={(e) => setBookLoanId(e.target.value)}
                color={getTextFieldColor()}
                focused
                helperText={scanResult?.message}
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>
          <Box sx={{ bgcolor: "background.paper", boxShadow: 1, marginTop: 2 }}>
            {scanResult?.is_eligible && <LoanTable loan={scanResult.data} />}
          </Box>
          {scanResult?.is_eligible && (
            <Button 
              onClick={handleReturn}
              sx={{ mt: 2 }}
              variant="contained"
              size="large"
              fullWidth
              endIcon={<MenuBookIcon />}
              disabled={returnBookMutation.isPending}
            >
              RETURN BOOK
            </Button>
          )}
        </Grid>
        <Grid item xs={7}>
          <DataTable
            createButtonTitle="ISSUE BOOK"
            columnsData={tableHeader}
            data={loansData?.data ?? []}
            viewOnClick={(row) => setBookLoanId(row.id)}
            showDeleteBtn={true}
            showStatus={false}
            showEditBtn={true}
            showAllRows={false}
            showVIewIcon={false}
            deleteOnClick={() => {}}
            showLoading={isLoansLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
            onSearch={handleSearchChange}
            rowsPerPage={row}
            rowPageCount={loansData?.total ?? 0}
            currentPage={page}
            setRowsPerPage={setRow}
            setChangePage={setPage}
            marginTop={"2px"}
            setDeleteOnClick={(row) => deleteMutation.mutate(row.id)}
            setEditOnClick={(row) => {
              setSelectedRow(row);
              setIsModalOpen(true);
            }}
            handleOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        </Grid>
      </Grid>

      {selectedRow && (
        <EditModal
          title="Issue Book"
          editableColumns={editableColumns}
          open={isModalOpen}
          handleClose={() => {
            setIsModalOpen(false);
            setSelectedRow(null);
          }}
          rowData={selectedRow}
          handleSave={updateMutation.mutate}
        />
      )}

      <CreateModal
        title="Issue Book"
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
        handleCreate={createMutation.mutate}
        createableColumns={createableColumns}
      />
    </>
  );
};

export default BookLoans;
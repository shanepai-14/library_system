import React, { useState, useEffect } from "react";
import DataTable from "../../Tables/DynamicTable";
import api from "../../../Utils/interceptor";
import {
  updateBookLoans,
  deleteBookLoans,
  getBooksLoans,
  checkBookLoanReturn 
} from "../../../Utils/endpoint";
import EditModal from "../../Modals/EditModal";
import CreateModal from "../../Modals/CreateModal";
import Grid from '@mui/material/Grid';
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { TextField , Typography} from "@mui/material";
import { useZxing } from "react-zxing";
import LoanTable from "../../Tables/LoanTable";

const BookLoans = () => {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [row, setRow] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookLoanId, setBookLoanId] = useState('');
  const [scanResult, setScanResult] = useState({ is_eligible: false , state:true  });
  const [isScanning, setIsScanning] = useState(false);

  const { ref, torch, reset } = useZxing({
    onDecodeResult(result) {
      setBookLoanId(result.getText());
      setIsScanning(false);
    },
    paused: !isScanning,
  });
  useEffect(() => {
    fetchTableData();
  }, [page, row, search]);

  useEffect(() => {
    if (bookLoanId) {
      checkBookLoan(bookLoanId);
    }
  }, [bookLoanId]);

  const checkBookLoan =  (id) => {
  
    api
    .get(checkBookLoanReturn(id))
    .then((res) => {

      setScanResult(res.data);
      

    })
    .catch((error) => {
      console.error("Error creating Book Issue:", error);
      setScanResult({ is_eligible: false, message: 'Not found' });
    
    })
    .finally(() => {

    });
  };
const handleReturn = () => {
    returnBook(bookLoanId);
}

const returnBook = (id) => {

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
            // Call API to return the book
            api.post(checkBookLoanReturn(id))
              .then((returnRes) => {
                Swal.fire(
                  'Returned!',
                  returnRes.data.message,
                  'success'
                );
                fetchTableData();
                setBookLoanId('');
                setScanResult({ is_eligible: false, state:true });
              })
              .catch((error) => {
                Swal.fire(
                  'Error!',
                  'Failed to return the book: ' + error.message,
                  'error'
                );
              });
          }
    })
};

  const fetchTableData = () => {
    setLoading(true);

    const params = {
      page: page,
      row: row,
      search: search,
    };

    api.get(getBooksLoans(), { params }).then((res) => {
      const transformedData = res.data.data.map((item) => {
        let transformedItem = {
          ...item,
          book: item.book ? item.book.title : "",
          user: item.user
            ? `${item.user.first_name} ${item.user.last_name}`
            : "",
          isbn: item.book ? item.book.isbn : "",
        };

        // Calculate status based on due_date and loan_date
        const currentDate = dayjs();
        const dueDate = dayjs(item.due_date);
        const loanDate = dayjs(item.loan_date);

        if (item.actual_return_date) {
          transformedItem.status = "Returned";
          } else if (currentDate.isAfter(dueDate)) {
          transformedItem.status = "Overdue";
          } else if (currentDate.isBefore(loanDate)) {
          transformedItem.status = "Scheduled";
          } else {
          transformedItem.status = "On Loan";
          }

        return transformedItem;
      });

      setBooks(transformedData);
      console.log(res);

      setTotal(res.data.total);
      setLoading(false);
    });
  };
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1); // Reset to first page on new search
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCreate = (newData) => {
    setLoading(true);

    api
      .post(getBooksLoans(), newData)
      .then((res) => {
        console.log("Issue book created:", res.data);

        Swal.fire({
          title: "Success!",
          text: "New Issue Book has been created.",
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchTableData(); // Refresh the list
      })
      .catch((error) => {
        console.error("Error creating Book Issue:", error);

        if (error.response && error.response.status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          let errorMessage = "";

          // Construct error message from validation errors
          Object.keys(validationErrors).forEach((key) => {
            errorMessage += `\n${validationErrors[key].join(", ")}`;
          });

          Swal.fire({
            title: "All copies occupied",
            text: errorMessage,
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          // Handle other types of errors
          Swal.fire({
            title: "Error!",
            text: "Failed to create Book Issue. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSave = (editedData) => {
    setLoading(true);

    api
      .put(updateBookLoans(editedData.id), editedData)
      .then((res) => {
        console.log("Book Issue  updated:", res.data);

        // Show success message (you can use a toast notification or SweetAlert here)
        Swal.fire({
          title: "Success!",
          text: "Book  has been updated.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Refresh the categories list
        fetchTableData();
      })
      .catch((error) => {
        console.error("Error updating Book Issue :", error);
        if (error.response && error.response.status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          let errorMessage = "";

          // Construct error message from validation errors
          Object.keys(validationErrors).forEach((key) => {
            errorMessage += `\n${validationErrors[key].join(", ")}`;
          });

          Swal.fire({
            title: "All copies occupied",
            text: errorMessage,
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          // Show error message
          Swal.fire({
            title: "Error!",
            text: "Failed to update Book Issue . Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(deleteBookLoans(row.id))
          .then((res) => {
            fetchTableData();
            Swal.fire("Deleted!", "Book Issue has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the an Book Issue.",
              "error"
            );
          });
      }
    });
  };

  const handleManualInput = (event) => {
    setBookLoanId(event.target.value);
  };

  const getTextFieldColor = () => {
    if (!scanResult) return 'primary';
    if (scanResult.state) return 'primary';
    return scanResult.is_eligible ? 'success' : 'error';
  };
  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };



  const viewOnClick = (row) => {

    setBookLoanId(row.id);

  }

  const createableColumns = ["user_id", "book_id", "due_date"];
  const editableColumns = ["user_id", "book_id", "due_date"];
  const tableHeader = [
    { headerName: "ID", align: "left", accessor: "id" },
    { headerName: "Borrower", align: "left", accessor: "user" },
    { headerName: "Book Name", align: "left", accessor: "book" },
    { headerName: "ISBN", align: "left", accessor: "isbn" },
    { headerName: "Issue Date", align: "left", accessor: "loan_date" },
    { headerName: "Due date", align: "left", accessor: "due_date" },
    {
      headerName: "Returned date",
      align: "left",
      accessor: "actual_return_date",
    },
    { headerName: "Status", align: "left", accessor: "status" },
  ];
  return (
    <>
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={4.5}>
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
            }}
          >
            <Button onClick={toggleScanning} sx={{ marginLeft: 2 }}>
              {isScanning ? "Stop Scanning" : "Start Scanning"}
            </Button>

            {isScanning && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 0,
                  paddingBottom: "75%",
                  mb: 2,
                }}
              >
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
                onChange={handleManualInput}
                color={getTextFieldColor()}
                focused
                helperText={scanResult?.message}
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              marginTop: 2,
            }}
          >
            {scanResult.is_eligible && (
            
                <LoanTable loan={scanResult.data} />

            
            )}
          </Box>
          {scanResult.is_eligible && (
                <Button onClick={handleReturn} sx={{ mt: 2 }} variant="contained" size="large" fullWidth endIcon={<MenuBookIcon />}>
                  RETURN BOOK
                </Button>
            )}
        </Grid>
        <Grid item xs={7}>
          <DataTable
            createButtonTitle="ISSUE BOOK"
            columnsData={tableHeader}
            data={books ?? []}
             viewOnClick={viewOnClick}
            showDeleteBtn={true}
            showStatus={false}
            showEditBtn={true}
            showAllRows={false}
            showVIewIcon={false}
            deleteOnClick={() => {}}
            showLoading={loading}
            onSearch={(val) => {
              handleSearchChange(val);
            }}
            rowsPerPage={row}
            rowPageCount={total}
            currentPage={page}
            setRowsPerPage={(e) => setRow(e)}
            setChangePage={(e) => setPage(e)}
            marginTop={"2px"}
            setDeleteOnClick={(row) => {
              handleDelete(row);
            }}
            setEditOnClick={(row) => {
              handleEdit(row);
            }}
            handleOpenCreateModal={handleOpenCreateModal}
          />
        </Grid>
      </Grid>
      {selectedRow && (
        <EditModal
          title="Issue Book"
          editableColumns={editableColumns}
          open={isModalOpen}
          handleClose={handleClose}
          rowData={selectedRow}
          handleSave={handleSave}
        />
      )}

      <CreateModal
        title="Issue Book"
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleCreate={handleCreate}
        createableColumns={createableColumns}
      />
    </>
  );
};

export default BookLoans;

import React, {useState , useEffect} from 'react';
import DataTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { updateBookLoans, deleteBookLoans , getBooksLoans } from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateModal from '../../Modals/CreateModal';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const BookLoans = () => {
    const [page, setPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [row , setRow] = useState(5);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    


    useEffect(() => {
        fetchTableData();
    }, [page, row, search]);

    const fetchTableData = () => {
        setLoading(true);

      const params = {
        page: page,
        row: row,
        search: search,
      };

      api.get(getBooksLoans(), { params }).then((res) => {

        const transformedData = res.data.data.map(item => {
            let transformedItem = {
                ...item,
                book: item.book ? item.book.title : '',
                user: item.user ? `${item.user.first_name} ${item.user.last_name}` : '',
                isbn: item.book ? item.book.isbn : '',
            };
        
            // Calculate status based on due_date and loan_date
            const currentDate = dayjs();
            const dueDate = dayjs(item.due_date);
            const loanDate = dayjs(item.loan_date);
        
            if (item.return_date) {
                transformedItem.status = 'Returned';
            } else if (currentDate.isAfter(dueDate)) {
                transformedItem.status = 'Overdue';
            } else if (currentDate.isAfter(loanDate) || currentDate.isSame(loanDate)) {
                if (currentDate.isBefore(dueDate) || currentDate.isSame(dueDate)) {
                    transformedItem.status = 'On Loan';
                } else {
                    transformedItem.status = 'Overdue';
                }
            } else if (currentDate.isBefore(loanDate)) {
                transformedItem.status = 'Scheduled';
            } else {
                transformedItem.status = 'Unknown';
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
        console.log(newData, getBooksLoans)

 
        api.post(getBooksLoans(), newData)
          .then((res) => {
            console.log('Issue book created:', res.data);
            
            Swal.fire({
              title: 'Success!',
              text: 'New Issue Book has been created.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            fetchTableData(); // Refresh the list
          })
          .catch((error) => {
            console.error('Error creating Book Issue :', error);
            
            Swal.fire({
              title: 'Error!',
              text: 'Failed to create Book Issue . Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      };

      const handleSave = (editedData) => {
        setLoading(true);
      
        api.put(updateBookLoans(editedData.id), editedData,)
          .then((res) => {
            console.log('Book Issue  updated:', res.data);
            
            // Show success message (you can use a toast notification or SweetAlert here)
            Swal.fire({
              title: 'Success!',
              text: 'Book  has been updated.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            // Refresh the categories list
            fetchTableData();
          })
          .catch((error) => {
            console.error('Error updating Book Issue :', error);
            
            // Show error message
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update Book Issue . Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      };

      const handleDelete = (row) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            api.delete(deleteBookLoans(row.id)).then((res) => {
              fetchTableData();
              Swal.fire(
                'Deleted!',
                'Book Issue has been deleted.',
                'success'
              );
            }).catch((error) => {
              Swal.fire(
                'Error!',
                'There was a problem deleting the an Book Issue.',
                'error'
              );
            });
          }
        });
      };

      const createableColumns = ["user_id","book_id","due_date"];
      const editableColumns = ["user_id","book_id","due_date"];  
      const tableHeader = [
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
         <DataTable
           createButtonTitle = "ISSUE BOOK"
           columnsData={tableHeader}
           data={books ?? []}
        //    viewOnClick={viewUser}
           showDeleteBtn={true}
           showStatus={false}
           showEditBtn={true}
           showAllRows={false}
           showVIewIcon={false}
           deleteOnClick={() => {}}
           showLoading={loading}
           onSearch={(val) => {handleSearchChange(val) }}
           rowsPerPage={row}
           rowPageCount={total}
           currentPage={page}
            setRowsPerPage={(e) => setRow(e)}
             setChangePage={(e) => setPage(e)}
             marginTop={"2px"}
             setDeleteOnClick={(row) => {handleDelete(row)}}
             setEditOnClick={(row) => {handleEdit(row)}}
           handleOpenCreateModal={handleOpenCreateModal}
         
         
         />
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
    )
}

export default  BookLoans
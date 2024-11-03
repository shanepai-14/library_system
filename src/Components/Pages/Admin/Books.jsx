import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../Tables/DynamicTable';
import api from '../../../Utils/interceptor';
import { getBooks, deleteBooks, updateBooks, activeBookLoans } from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateBook from '../../Modals/CreateBookModal';
import { tableHeader } from '../../../Utils/helper';
import Swal from 'sweetalert2';
import ViewModal from '../../Modals/ViewModal';
import BookDetailsModal from '../../Modals/BookDetailsModal';

const Books = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [row, setRow] = useState(5);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState({ id: 0 });
    const [selectedBook, setSelectedBook] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // Main query for fetching books
    const { 
        data: booksData, 
        isLoading,
        isError,
        error 
    } = useQuery({
        queryKey: ['books', page, row, search],
        queryFn: async () => {
            const response = await api.get(getBooks(), { 
                params: { page, row, search } 
            });
            
            // Transform the data
            const transformedData = response.data.data.map(item => ({
                ...item,
                author: item.author ? item.author.name : '',
                category: item.category ? item.category.name : '',
                shelve_no: item.category ? item.category.shelve_no : '',
            }));

            return {
                data: transformedData,
                total: response.data.total
            };
        },
    });

    // Create mutation
    const createMutation = useMutation({
      mutationFn: async (newData) => {
        const formData = new FormData();
        
        // Handle all fields including subject_ids array
        Object.keys(newData).forEach(key => {
          if (key === 'subject_ids') {
            // Handle array of subject IDs
            newData[key].forEach((subjectId, index) => {
              formData.append(`subject_ids[${index}]`, subjectId);
            });
          } else if (key === 'image') {
            // Handle image file
            if (newData.image instanceof File) {
              formData.append('image', newData.image);
            }
          } else {
            // Handle all other fields
            formData.append(key, newData[key]);
          }
        });
    
        return api.post(getBooks(), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['books']);
        setIsCreateModalOpen(false);
        Swal.fire({
          title: 'Success!',
          text: 'New Book has been created.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      onError: (error) => {
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Failed to create book. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (editedData) => {
            const formData = new FormData();
            
            // Append all fields except image
            Object.keys(editedData).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, editedData[key]);
                }
            });

            // Handle image upload
            if (editedData.image) {
                if (editedData.image instanceof Blob) {
                    formData.append('image', editedData.image, editedData.image.name);
                }
            }

            formData.append('_method', 'PUT');

            return api.post(updateBooks(editedData.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['books']);
            setIsModalOpen(false);
            setSelectedRow(null);
            Swal.fire({
                title: 'Success!',
                text: 'Book has been updated.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update book. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(deleteBooks(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['books']);
            Swal.fire(
                'Deleted!',
                'Book has been deleted.',
                'success'
            );
        },
        onError: (error) => {
            Swal.fire(
                'Error!',
                error.message || 'There was a problem deleting the book.',
                'error'
            );
        },
    });

    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };

    const handleCreate = (newData) => {
        createMutation.mutate(newData);
    };

    const handleSave = (editedData) => {
        updateMutation.mutate(editedData);
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
                deleteMutation.mutate(row.id);
            }
        });
    };

    const viewOnClick = (row) => {
        setViewData(row);
        setIsViewModalOpen(true);
    };


    const viewEyeOnClick = (row) => {
      setSelectedBook(row);
      setOpenModal(true);
    };
    // Error handling for main query
    if (isError) {
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to fetch books',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

   
    const editableColumns = ["title", "book_price", "total_copies", "isbn", "publication_year", "author_id", "category_id", "image"];
    const BookLoanHeader = [
        { headerName: "Borrower", align: "left", accessor: "user" },
        { headerName: "ISBN", align: "left", accessor: "isbn" },
        { headerName: "Issue Date", align: "left", accessor: "loan_date" },
        { headerName: "Due date", align: "left", accessor: "due_date" },
        { headerName: "Status", align: "left", accessor: "status" },
    ];

    return (
        <>
            <DataTable
                createButtonTitle="ADD BOOK"
                columnsData={tableHeader}
                data={booksData?.data ?? []}
                viewOnClick={viewOnClick}
                showDeleteBtn={true}
                showStatus={false}
                showEditBtn={true}
                showVIewIcon={true}
                showAllRows={false}
                viewEyeOnClick={viewEyeOnClick}
                deleteOnClick={() => { }}
                showLoading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                onSearch={handleSearchChange}
                rowsPerPage={row}
                rowPageCount={booksData?.total ?? 0}
                currentPage={page}
                setRowsPerPage={setRow}
                setChangePage={setPage}
                marginTop={"2px"}
                setDeleteOnClick={handleDelete}
                setEditOnClick={(row) => {
                    setSelectedRow(row);
                    setIsModalOpen(true);
                }}
                handleOpenCreateModal={() => setIsCreateModalOpen(true)}
            />

            {selectedRow && (
                <EditModal
                    title="Edit Book"
                    editableColumns={editableColumns}
                    open={isModalOpen}
                    handleClose={() => {
                        setIsModalOpen(false);
                        setSelectedRow(null);
                    }}
                    rowData={selectedRow}
                    handleSave={handleSave}
                />
            )}

            <CreateBook
              open={isCreateModalOpen}
              handleClose={() => setIsCreateModalOpen(false)}
              handleCreate={handleCreate}
            />

            <ViewModal
                title="Book"
                open={isViewModalOpen}
                handleClose={() => setIsViewModalOpen(false)}
                viewData={viewData}
                url={activeBookLoans}
                tableHeader={BookLoanHeader}
            />

          <BookDetailsModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              book={selectedBook}
            />
        </>
    );
};

export default Books;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthorTable from '../../Tables/DynamicTable';
import api from '../../../Utils/interceptor';
import { getAuthors, deleteAuthors, updateAuthors, booksAuthor } from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateAuthorModal from '../../Modals/CreateModal';
import ViewModal from '../../Modals/ViewModal';
import Swal from 'sweetalert2';
import { tableHeader } from '../../../Utils/helper';

const Authors = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [row, setRow] = useState(5);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState({ id: 0 });

    // Main query for fetching authors
    const { 
        data: authorsData, 
        isLoading,
        isError,
        error 
    } = useQuery({
        queryKey: ['authors', page, row, search],
        queryFn: async () => {
            const response = await api.get(getAuthors(), { 
                params: { page, row, search } 
            });
            return response.data;
        },
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (newAuthorData) => api.post(getAuthors(), newAuthorData),
        onSuccess: () => {
            queryClient.invalidateQueries(['authors']);
            setIsCreateModalOpen(false);
            Swal.fire({
                title: 'Success!',
                text: 'New Author has been created.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to create Author. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (editedData) => api.put(updateAuthors(editedData.id), editedData),
        onSuccess: () => {
            queryClient.invalidateQueries(['authors']);
            setIsModalOpen(false);
            setSelectedRow(null);
            Swal.fire({
                title: 'Success!',
                text: 'Author has been updated.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update Author. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(deleteAuthors(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['authors']);
            Swal.fire(
                'Deleted!',
                'An Author has been deleted.',
                'success'
            );
        },
        onError: (error) => {
            Swal.fire(
                'Error!',
                error.message || 'There was a problem deleting the author.',
                'error'
            );
        },
    });

    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };

    const handleCreate = (newAuthorData) => {
        createMutation.mutate(newAuthorData);
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

    // Error handling for main query
    if (isError) {
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to fetch authors',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    const createableColumns = ["name"];
    const editableColumns = ["name"];
    const authorHeader = [
        { headerName: "Name", align: "left", accessor: "name" },
        { headerName: "Created date", align: "left", accessor: "created_at" },
        { headerName: "Updated date", align: "left", accessor: "updated_at" },
    ];

    return (
        <>
            <AuthorTable
                createButtonTitle="ADD AUTHOR"
                columnsData={authorHeader}
                data={authorsData?.data ?? []}
                viewOnClick={viewOnClick}
                showDeleteBtn={true}
                showStatus={false}
                showEditBtn={true}
                showAllRows={false}
                showVIewIcon={false}
                deleteOnClick={() => { }}
                showLoading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                onSearch={handleSearchChange}
                rowsPerPage={row}
                rowPageCount={authorsData?.total ?? 0}
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
                    title="Edit Author"
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

            <CreateAuthorModal
                title="Create a new author"
                open={isCreateModalOpen}
                handleClose={() => setIsCreateModalOpen(false)}
                handleCreate={handleCreate}
                createableColumns={createableColumns}
            />

            <ViewModal
                title="Author"
                open={isViewModalOpen}
                handleClose={() => setIsViewModalOpen(false)}
                viewData={viewData}
                url={booksAuthor}
                tableHeader={tableHeader}
            />
        </>
    );
};

export default Authors;
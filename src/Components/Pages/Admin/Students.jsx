import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../Tables/DynamicTable';
import api from '../../../Utils/interceptor';
import { getUsers, deactivateStudent } from '../../../Utils/endpoint';
import UserPasswordRecovery from '../../Modals/UserPasswordRecovery';
import Swal from 'sweetalert2';

const Students = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [row, setRow] = useState(5);
    const [search, setSearch] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState('');

    // Main query for fetching students
    const {
        data: studentsData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['students', page, row, search],
        queryFn: async () => {
            const response = await api.get(getUsers(), {
                params: { page, row, search }
            });

            // Transform the data
            const transformedData = response.data.data.map(item => ({
                ...item,
                student_name: item.first_name ? `${item.first_name} ${item.last_name}` : '',
                course_year: item.course ? `${item.course} ${item.year_level}` : '',
            }));

            return {
                data: transformedData,
                total: response.data.total
            };
        },
        keepPreviousData: true, // Keep previous data while fetching new data
    });

    // Deactivate student mutation
    const deactivateMutation = useMutation({
        mutationFn: (id) => api.delete(deactivateStudent(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            Swal.fire({
                title: 'Deleted!',
                text: 'The student has been deactivated.',
                icon: 'success',
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'There was a problem deactivating the student.',
                icon: 'error'
            });
        },
    });

    // Handlers
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };

    const handleDelete = (row) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "The student will be deactivated",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deactivateMutation.mutate(row.id);
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
            text: error.message || 'Failed to fetch students',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    const StudentHeader = [
        { headerName: "ID Number", align: "left", accessor: "id_number" },
        { headerName: "Avatar", align: "left", accessor: "profile_picture" },
        { headerName: "Student Name", align: "left", accessor: "student_name" },
        { headerName: "Mobile Number", align: "left", accessor: "contact_number" },
        { headerName: "Course and Year", align: "left", accessor: "course_year" },
        { headerName: "Registration Date", align: "left", accessor: "created_at" },
    ];

    return (
        <>
            <DataTable
                columnsData={StudentHeader}
                data={studentsData?.data ?? []}
                viewOnClick={viewOnClick}
                showStatus={false}
                showAllRows={false}
                showVIewIcon={true}
                deleteOnClick={() => { }}
                showLoading={isLoading || deactivateMutation.isPending}
                onSearch={handleSearchChange}
                rowsPerPage={row}
                rowPageCount={studentsData?.total ?? 0}
                currentPage={page}
                setRowsPerPage={setRow}
                setChangePage={setPage}
                marginTop={"2px"}
                setDeleteOnClick={handleDelete}
                showDeleteBtn={true}
            />

            <UserPasswordRecovery
                open={isViewModalOpen}
                handleClose={() => {
                    setIsViewModalOpen(false);
                    setViewData('');
                }}
                userId={viewData.id}
            />
        </>
    );
};

export default Students;
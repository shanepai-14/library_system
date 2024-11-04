import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '../../Tables/DynamicTable';
import api from '../../../Utils/interceptor';
import { getAttendance } from '../../../Utils/endpoint';
import Swal from 'sweetalert2';
import LibraryAnalyticsDashboard from '../../Charts/LibraryAnalyticsDashboard';
import DailyAttendanceChart from '../../Charts/DailyAttendanceChart';
import MonthlyAttendanceChart from '../../Charts/MonthlyAttendanceChart';
import WeeklyAttendanceChart from '../../Charts/WeeklyAttendanceChart';
import UserPasswordRecovery from '../../Modals/UserPasswordRecovery';
import { Grid } from '@mui/material';

const AttendancePage = () => {
    const [page, setPage] = useState(1);
    const [row, setRow] = useState(10);
    const [search, setSearch] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState('');

    // Main query for fetching attendance data
    const {
        data: attendanceData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['attendance', page, row, search],
        queryFn: async () => {
            const response = await api.get(getAttendance(), {
                params: { page, row, search }
            });

            // Transform the data
            const transformedData = response.data.data.map(item => ({
                ...item,
                id_number: item.user ? item.user.id_number : '',
                name: item.user ? `${item.user.first_name} ${item.user.last_name}` : '',
                course_year: item.user ? `${item.user.course} ${item.user.year_level}` : '',
            }));

            return {
                data: transformedData,
                total: response.data.total
            };
        },
        keepPreviousData: true, // Keep previous data while fetching new data
        staleTime: 30000, // Consider data fresh for 30 seconds
        retry: 2, // Retry failed requests twice
    });

    // Handlers
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };

    const viewOnClick = (row) => {
        setViewData(row);
        setIsViewModalOpen(true);
    };

    // Error handling for main query
    if (isError) {
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to fetch attendance data',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    // Table headers configuration
    const AttendanceHeader = [
        { headerName: "User ID", align: "left", accessor: "id_number" },
        { headerName: "Name", align: "left", accessor: "name" },
        { headerName: "Course and Year", align: "left", accessor: "course_year" },
        { headerName: "Log Date", align: "left", accessor: "created_at" },
        { headerName: "Check IN", align: "left", accessor: "check_in" },
        { headerName: "Check OUT", align: "left", accessor: "check_out" },
        { headerName: "Purpose", align: "left", accessor: "notes" },
    ];

    return (
        <>
            {/* Analytics Dashboard */}
            <LibraryAnalyticsDashboard />

            {/* Charts Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <DailyAttendanceChart />
                </Grid>
                <Grid item xs={12} md={6}>
                    <WeeklyAttendanceChart />
                </Grid>
            </Grid>
            
            {/* Monthly Chart */}
            <MonthlyAttendanceChart />

            {/* Attendance Table */}
            <DataTable
                columnsData={AttendanceHeader}
                data={attendanceData?.data ?? []}
                viewEyeOnClick={viewOnClick}
                showStatus={false}
                showAllRows={true}
                showVIewIcon={true}
                showLoading={isLoading}
                onSearch={handleSearchChange}
                rowsPerPage={row}
                rowPageCount={attendanceData?.total ?? 0}
                currentPage={page}
                setRowsPerPage={setRow}
                setChangePage={setPage}
                marginTop={"2px"}
            />

        <UserPasswordRecovery
                open={isViewModalOpen}
                handleClose={() => {
                    setIsViewModalOpen(false);
                    setViewData('');
                }}
                userId={viewData.user_id}
            />
        </>
    );
};

export default AttendancePage;
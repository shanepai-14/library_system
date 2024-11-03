import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Tooltip as MuiTooltip,
  IconButton,
  Alert,
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import DateFilter from './DateFilter';
import api from '../../Utils/interceptor';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useReactToPrint } from 'react-to-print';
import { DEPARTMENTS_COLORS } from '../../Utils/helper';
import { monthlyAttendance } from '../../Utils/endpoint';
const MonthlyAttendanceChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const contentRef = useRef(null);

  // Query for fetching monthly analytics
  const {
    data: monthlyData = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['monthlyAttendance', selectedYear, selectedMonth],
    queryFn: async () => {
      const response = await api.get(monthlyAttendance(), {
        params: {
          year: selectedYear,
          month: selectedMonth
        }
      });
      return response.data;
    },
    staleTime: 300000, // Consider data fresh for 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching monthly analytics:', error);
    }
  });

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Monthly_Attendance_${selectedYear}_${selectedMonth}`,
    removeAfterPrint: true,
  });

  // Render functions
  const renderHeader = () => {
    const monthName = new Date(selectedYear, selectedMonth - 1)
      .toLocaleString('default', { month: 'long' });

    return (
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6">
          Daily Attendance for {monthName} {selectedYear}
        </Typography>
        <Box display="flex" gap={2}>
          <DateFilter
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
          />
          {isError && (
            <MuiTooltip title="Retry">
              <IconButton 
                onClick={() => refetch()}
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            </MuiTooltip>
          )}
          <MuiTooltip title="Print Chart">
            <IconButton 
              onClick={handlePrint}
              size="small"
            >
              <PrintIcon />
            </IconButton>
          </MuiTooltip>
        </Box>
      </Box>
    );
  };

  const renderChart = () => (
    <ResponsiveContainer>
      <BarChart
        data={monthlyData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.entries(DEPARTMENTS_COLORS).map(([dept, color]) => (
          <Bar 
            key={dept} 
            dataKey={dept} 
            fill={color} 
            name={dept}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      );
    }

    if (isError) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height={400}
        >
          <Alert 
            severity="error" 
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => refetch()}
              >
                <RefreshIcon />
              </IconButton>
            }
          >
            {error.message || 'Error loading monthly attendance data'}
          </Alert>
        </Box>
      );
    }

    if (monthlyData.length === 0) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={400}
        >
          <Typography variant="body1" color="text.secondary">
            No attendance data available for this period
          </Typography>
        </Box>
      );
    }

    return renderChart();
  };

  return (
    <Card sx={{ mb: 2 }}> 
      <CardContent>
        {renderHeader()}
        <Box 
          sx={{ 
            width: '100%', 
            height: 400,
            backgroundColor: 'white'
          }} 
          ref={contentRef}
        >
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthlyAttendanceChart;
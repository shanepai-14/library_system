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
import  { weeklyAttendance } from '../../Utils/endpoint';

const WeeklyAttendanceChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const contentRef = useRef(null);

  // Query for fetching weekly analytics
  const {
    data: weeklyData = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['weeklyAttendance', selectedYear, selectedMonth],
    queryFn: async () => {
      const response = await api.get(weeklyAttendance(), {
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
      console.error('Error fetching weekly analytics:', error);
    }
  });

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Weekly_Attendance_${selectedMonth}_${selectedYear}`,
    removeAfterPrint: true,
  });

  // Render functions
  const renderHeader = () => {
    const monthName = new Date(selectedYear, selectedMonth - 1)
      .toLocaleString('default', { month: 'long' });

    return (
      <Box sx={{ 
        mb: 0, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
          Weekly Attendance for {monthName} {selectedYear}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={weeklyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
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
    </Box>
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
            {error.message || 'Error loading weekly attendance data'}
          </Alert>
        </Box>
      );
    }

    if (weeklyData.length === 0) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={400}
        >
          <Typography variant="body1" color="text.secondary">
            No weekly attendance data available for this period
          </Typography>
        </Box>
      );
    }

    return renderChart();
  };

  return (
    <Card>
      <CardContent>
        {renderHeader()}
        <Box 
          ref={contentRef} 
          sx={{ 
            backgroundColor: 'white',
            pt: 2
          }}
        >
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyAttendanceChart;
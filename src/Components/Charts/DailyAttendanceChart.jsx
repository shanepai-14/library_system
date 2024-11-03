import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Tooltip as MuiTooltip,
  IconButton,
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
import PrintIcon from '@mui/icons-material/Print';
import api from '../../Utils/interceptor';
import { useReactToPrint } from 'react-to-print';
import { DEPARTMENTS_COLORS } from '../../Utils/helper';
import { dailyAttendance } from '../../Utils/endpoint';

const DailyAttendanceChart = () => {
  const contentRef = useRef(null);

  // Query for fetching daily analytics
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['dailyAttendance'],
    queryFn: async () => {
      const response = await api.get(dailyAttendance());
      return response.data;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 60000, // Consider data fresh for 1 minute
    retry: 2, // Retry failed requests twice
    onError: (error) => {
      console.error('Error fetching daily analytics:', error);
    }
  });

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Todays_Attendance_${new Date().toLocaleDateString()}`,
    removeAfterPrint: true,
  });

  // Render functions
  const renderHeader = () => (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
        Today's Attendance
      </Typography>
      <Box>
        {isError && (
          <MuiTooltip title="Retry">
            <IconButton 
              onClick={() => refetch()}
              size="small"
              sx={{ mr: 1 }}
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

  const renderChart = () => (
    <ResponsiveContainer>
      <BarChart
        data={[dailyData]} 
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
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
          justifyContent="center" 
          alignItems="center" 
          height={400}
          flexDirection="column"
        >
          <Typography color="error" gutterBottom>
            Error loading data: {error.message}
          </Typography>
          <IconButton 
            onClick={() => refetch()}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
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
          sx={{ 
            width: '100%', 
            height: 407,
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

export default DailyAttendanceChart;
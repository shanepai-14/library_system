// DailyAttendanceChart.jsx
import React, { useState, useEffect ,useRef } from 'react';
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

const DailyAttendanceChart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const contentRef  = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Todays_Attendance`,
  removeAfterPrint: true,
  });

  const fetchDailyAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/analytics/daily');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching daily analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyAnalytics();
    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchDailyAnalytics, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
       <Box display="flex" justifyContent="space-between" >
       <Typography  sx={{fontWeight:'bold', fontSize:'14px'}}>
          Today's Attendance
        </Typography>
        <MuiTooltip title="Print Chart">
            <IconButton 
              onClick={handlePrint}
              size="small"
            >
              <PrintIcon />
            </IconButton>
          </MuiTooltip>
       </Box>
        <Box sx={{ width: '100%', height: 407 }} ref={contentRef}>
          <ResponsiveContainer>
            <BarChart
              data={[data]} // Wrap in array since it's single day data
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailyAttendanceChart;
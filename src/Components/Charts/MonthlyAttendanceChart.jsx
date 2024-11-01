// MonthlyAttendanceChart.jsx
import React, { useState, useEffect ,useRef} from 'react';
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
import DateFilter from './DateFilter';
import api from '../../Utils/interceptor';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { DEPARTMENTS_COLORS } from '../../Utils/helper';

const MonthlyAttendanceChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const contentRef  = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
  removeAfterPrint: true,
  });

  const fetchMonthlyAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/analytics/monthly', {
        params: {
          year: selectedYear,
          month: selectedMonth
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching monthly analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyAnalytics();
  }, [selectedYear, selectedMonth]);

  return (
    <Card sx={{mb:2}}> 
      <CardContent>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Daily Attendance for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
          </Typography>
          <DateFilter
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
          />
            <MuiTooltip title="Print Chart">
            <IconButton 
              onClick={handlePrint}
              size="small"
            >
              <PrintIcon />
            </IconButton>
          </MuiTooltip>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 400 }} ref={contentRef}>
            <ResponsiveContainer>
              <BarChart
                data={data}
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
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyAttendanceChart;
import React, { useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip as MuiTooltip,
  IconButton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../Utils/interceptor";
import { DEPARTMENTS_COLORS } from "../../Utils/helper";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";

// Constants
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const yearLevels = [
  { value: "all", label: "All Years" },
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "2nd Year", label: "3rd Year" },
  { value: "4th Year", label: "4th Year" },
  { value: "Grade 11", label: "Grade 11" },
  { value: "Grade 12", label: "Grade 12" },
];

const YEARS = Array.from({ length: 5 }, (_, i) => 2024 - i);

const LibraryAnalyticsDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYearLevel, setSelectedYearLevel] = useState("all");
  const contentRef = useRef(null);

  // Query for fetching analytics data
  const {
    data: analyticsData = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['libraryAnalytics', selectedYear, selectedYearLevel],
    queryFn: async () => {
      const response = await api.get('/attendance/analytics', {
        params: {
          year: selectedYear,
          year_level: selectedYearLevel,
        }
      });

      // Transform the data
      return response.data.map(item => ({
        ...item,
        month: monthNames[item.month - 1],
      }));
    },
    staleTime: 300000, // Consider data fresh for 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching analytics:", error);
    }
  });

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Library_Attendance_${selectedYear}_${selectedYearLevel}`,
    removeAfterPrint: true,
  });

  // Chart formatters
  const monthTickFormatter = (tick) => tick;

  const renderQuarterTick = (tickProps) => {
    const { x, y, payload } = tickProps;
    const monthIndex = monthNames.indexOf(payload.value);
    const quarterNo = Math.floor(monthIndex / 3) + 1;

    if (monthIndex % 3 === 1) {
      return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
    }
    return null;
  };

  // Render functions
  const renderFilters = () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={selectedYear}
          label="Year"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {YEARS.map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Year Level</InputLabel>
        <Select
          value={selectedYearLevel}
          label="Year Level"
          onChange={(e) => setSelectedYearLevel(e.target.value)}
        >
          {yearLevels.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MuiTooltip title="Print Chart">
        <IconButton onClick={handlePrint} size="small">
          <PrintIcon />
        </IconButton>
      </MuiTooltip>
    </Box>
  );

  const renderChart = () => (
    <ResponsiveContainer>
      <BarChart
        data={analyticsData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter={monthTickFormatter} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={renderQuarterTick}
          height={1}
          scale="band"
          xAxisId="quarter"
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.entries(DEPARTMENTS_COLORS).map(([dept, color]) => (
          <Bar key={dept} dataKey={dept} fill={color} name={dept} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Typography variant="h4" gutterBottom>
          Library Attendance Analytics
        </Typography>
        {renderFilters()}
      </Box>

      <Card>
        <CardContent>
          <Box 
            sx={{ 
              width: "100%", 
              height: 500, 
              backgroundColor: "white" 
            }} 
            ref={contentRef}
          >
            {isLoading ? (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height={400} 
                sx={{ backgroundColor: 'white' }}
              >
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height={400}
              >
                <Typography color="error">
                  Error loading data: {error.message}
                </Typography>
              </Box>
            ) : (
              renderChart()
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LibraryAnalyticsDashboard;
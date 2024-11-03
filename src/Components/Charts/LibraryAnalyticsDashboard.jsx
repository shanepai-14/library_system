import React, { useState, useEffect, useRef } from "react";
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
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const LibraryAnalyticsDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYearLevel, setSelectedYearLevel] = useState("all");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Todays_Attendance`,
    removeAfterPrint: true,
  });

  // Generate last 5 years for select
  const years = Array.from({ length: 5 }, (_, i) => 2024 - i);

  const monthTickFormatter = (tick) => {
    return tick;
  };

  const renderQuarterTick = (tickProps) => {
    const { x, y, payload } = tickProps;
    const month = payload.value;
    const quarterNo = Math.floor((parseInt(month) - 1) / 3) + 1;

    if ((parseInt(month) - 1) % 3 === 1) {
      return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
    }

    return null;
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/attendance/analytics`, {
        params: {
          year: selectedYear,
          year_level: selectedYearLevel,
        },
      });
      const convertedData = response.data.map((item) => ({
        ...item,
        month: monthNames[item.month - 1], // -1 because array is 0-based but months start at 1
      }));

      setData(convertedData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear, selectedYearLevel]);



  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Library Attendance Analytics
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
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
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ width: "100%", height: 500 , backgroundColor:"white"}} ref={contentRef}>
            {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}  sx={{backgroundColor:'white'}}>
              <CircularProgress />
            </Box>
            ) : (
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
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LibraryAnalyticsDashboard;

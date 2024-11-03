import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  LinearProgress,
  Paper,
} from "@mui/material";
import { postAttendance, checkStudent } from "../../../Utils/endpoint";
import api from "../../../Utils/interceptor";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import ReasonCards from "./ReasonCards";
import Scanner from "./Scanner";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { styled } from '@mui/material/styles';
import AttendanceSuccessDialog from "./AttendanceSuccessDialog";


const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("/library.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15,
    zIndex: -1
  }
}));

const GlassBox = styled(Paper)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  maxWidth: '600px',
  width: '100%',
  margin: 'auto'
}));

const DigitalClock = styled(Typography)(({ theme }) => ({
  fontFamily: "'Orbitron', sans-serif",
  fontSize: '3.5rem',
  letterSpacing: '0.1em',
  color: theme.palette.primary.main,
  textAlign:'center',
  textShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(1),
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    }
  }
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: '100%' }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5
            }
          }}
          variant="determinate"
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const AttendanceSystem = () => {
  const [scanResult, setScanResult] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [studentID, setStudentID] = useState("");
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [manualUserID, setManualUserID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedReasons != "") {
      submitAttendance(studentID, selectedReasons);
    }
  }, [selectedReasons]);


  const fetchStudentData = (id) => {
    setLoading(true);
    const data = {
      id_number: id,
    };

    api
      .post(checkStudent(), data)
      .then((res) => {
        console.log(res.data);
        if (res.data.found) {
          if (res.data.message.includes("Check-out successful")) {
            const Time = new Date(
              res.data.attendance.check_out
            ).toLocaleTimeString();
            Swal.fire({
              title: res.data.message,
              html: `<h1>${Time}</strong>.</h1>`,
              icon: "success",
              timer: 2000
            });
            resetStates();
          } else if (res.data.message.includes("Ready for new check-in")) {
            setStudentID(res.data.student.id);
            setStudentName(res.data.student.first_name);
            setShowReasons(true);
          }

          if (res.data.message.includes("No check-in for today")) {
            setStudentID(res.data.student.id);
            setStudentName(res.data.student.first_name);
            setShowReasons(true);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Student Not Found",
            text: res.data.message,
            confirmButtonText: "OK",
            timer: 2000
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "An error occurred while fetching student data.";
        
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonText: "OK",
          timer: 2000
        });
      })
      .finally(() => {
        setIsScanning(true);
        setLoading(false);
      });
  };
  const submitAttendance = (id, reason) => {
    setProgress(20);
    const data = {
      user_id: id,
      notes: reason,
    };
    api
      .post(postAttendance(), data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      })
      .then((res) => {
        setProgress(100);
        setAttendanceData(res.data);
        setOpenSuccessDialog(true);
        resetStates();
      })

      .catch((err) => {
        Swal.fire({
          title: "You have already checked in and out for today",
          icon: "error",
          timer: 2000
        });

        resetStates();
      })
      .finally(() => {
        resetStates();
      });
  };

  const handleReasonClick = (reason) => {
    // Send attendance request with user data and reason
    console.log(`Checking in user: ${scanResult} for reason: ${reason}`);
    // Reset state
    setScanResult("");
    setShowReasons(false);
    setSelectedReasons(reason);
  };

  const handleInputChange = (event) => {
    const userID = event.target.value;
    setManualUserID(userID);
    debouncedFetchUserData(userID);
  };

  const debouncedFetchUserData = useCallback(
    debounce((userID) => {
      if (userID) {
        setIsScanning(false);
        fetchStudentData(userID);
      }
    }, 1000),
    []
  );

  const handleScan = (scannedUserID) => {
    setIsScanning(false);
    fetchStudentData(scannedUserID);
  };

  const resetStates = () => {
    setTimeout(() => {
      setIsScanning(true);
      setProgress(0);
      setStudentName("");
      setManualUserID("");
      setStudentID("");
      setShowReasons(false);
      setScanResult("");
      setSelectedReasons("");
    }, 100);
  };

  const reasons = [
    "Study",
    "Borrow Book",
    "Return Book",
    "Use Computer",
    "Research",
    "Other",
  ];

  return (
    <StyledContainer maxWidth={false}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'primary.main',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <LocalLibraryIcon fontSize="inherit"/>
          Library Attendance System
        </Typography>

        <GlassBox>
          {progress !== 0 ? (
            <Box sx={{ width: '100%', p: 2 }}>
              <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                Processing Attendance...
              </Typography>
              <LinearProgressWithLabel value={progress} />
            </Box>
          ) : !showReasons ? (
            <Box sx={{ width: '100%' }}>
              <StyledTextField
                label="Enter User ID or Scan QR Code"
                variant="outlined"
                value={manualUserID}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ width: '100%', mt: 2 }}>
                <Scanner onScan={handleScan} isScanning={isScanning} />
                {loading && (
                  <LinearProgress 
                    sx={{ 
                      mt: 2, 
                      height: 6, 
                      borderRadius: 3 
                    }} 
                  />
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  color: 'primary.main',
                  mb: 3,
                  fontWeight: 600
                }}
              >
                Welcome, {studentName}!
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  Please select your reason for visiting
                </Typography>
              </Typography>
              <ReasonCards reasons={reasons} onSubmit={handleReasonClick} />
            </Box>
          )}
        </GlassBox>

        <DigitalClock>
          {currentTime}
        </DigitalClock>
      </Box>
      <AttendanceSuccessDialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        data={attendanceData}
      />
    </StyledContainer>
  );
};

export default AttendanceSystem;

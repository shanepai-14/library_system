import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  LinearProgress,
} from "@mui/material";
import { postAttendance, checkStudent } from "../../../Utils/endpoint";
import api from "../../../Utils/interceptor";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import ReasonCards from "./ReasonCards";
import Scanner from "./Scanner";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          sx={{
            "--LinearProgress-progressThickness": "24px",
            "--LinearProgress-thickness": "24px",
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
  const [selectedReasons, setSelectedReasons] = useState("");
  const [manualUserID, setManualUserID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  // const fetchStudentData = (id) => {
  //   setLoading(true);
  //   const data = {
  //     id_number: id,
  //   };

  //   api
  //     .post(checkStudent(), data)
  //     .then((res) => {
  //       console.log(res.data);
  //       if (res.data.found) {
  //         setStudentID(res.data.student.id);
  //         setShowReasons(true);
  //         setStudentName(res.data.student.first_name);
  //       }
  //     })
  //     .catch((error) => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Student Not Found",
  //         text: "No student found with the provided ID number.",
  //         confirmButtonText: "OK",
  //       });
  //     })
  //     .finally(() => {
  //       setIsScanning(true);
  //       setLoading(false);
  //     });
  // };

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
          } else if (res.data.message.includes("already checked in and out")) {
            Swal.fire({
              title: "You have already checked in and out for today",
              icon: "error",
              timer: 2000
            });
          }

          if (res.data.message.includes("No check-in or check-out for today")) {
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching student data.",
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
        const message = res.data.message;
        const Time = new Date(
          res.data.attendance.check_in
        ).toLocaleTimeString();
        Swal.fire({
          title: message,
          html: `<h1>${Time}</strong>.</h1>`,
          icon: "success",
          timer: 2000
        });

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
      setScannerKey((prevKey) => prevKey + 1);
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
    <Container
      maxWidth="100%"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(180deg, #CEE5FD, #FFF)",
        margin: 0,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          mb={4}
          mt={2}
          color="text.primary"
          gutterBottom
        >
          <LocalLibraryIcon fontSize="inherit"/> Library Attendance System
        </Typography>

        <Box
          sx={{
            padding: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            borderColor: "primary.light",
            borderRadius: "10px",
            border: "1px solid rgb(156, 204, 252)",
            background: "white;",
          }}
        >
          {progress !== 0 ? (
            <Box width={500} sx={{ marginTop: 20 }}>
              <Typography
                variant="h6"
                sx={{ textAlign: "center" }}
                gutterBottom
              >
                Uploading Attendance
              </Typography>
              <LinearProgressWithLabel value={progress} />
            </Box>
          ) : !showReasons ? (
            <Box
              sx={{
                width: "100%",
                maxWidth: 500,
                position: "relative",
              }}
            >
              <TextField
                label="Enter User ID manually Or Scan QR Code"
                variant="outlined"
                value={manualUserID}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ marginTop: 0, bgcolor: "white" }}
              />
            </Box>
          ) : (
            <Box>
              <Typography
                sx={{ textAlign: "center",color: 'primary.main',marginBottom: 2}}
                variant="h4"
              >
                Hello {studentName} !! 
              </Typography>
              <Typography
                sx={{ textAlign: "center", marginBottom: 5 }}
                variant="h4"
                gutterBottom
              >
               Select reason for visit
              </Typography>
              <ReasonCards
                reasons={reasons}
                handleReasonClick={handleReasonClick}
              />
            </Box>
          )}

          {!showReasons && (
            <Box width="500px">
              <Scanner onScan={handleScan} isScanning={isScanning} />
              {loading && <LinearProgress thickness={20} color="primary" />}
            </Box>
          )}
        </Box>

        <Typography
          variant="h1"
          sx={{
            mt: 5,
            fontFamily: "'Orbitron', sans-serif",
            // You might want to adjust these properties for better appearance
            fontSize: "5rem",
            letterSpacing: "0.1em",
            fontWeight: "normal",
          }}
        >
          {currentTime}
        </Typography>
      </Container>
    </Container>
  );
};

export default AttendanceSystem;

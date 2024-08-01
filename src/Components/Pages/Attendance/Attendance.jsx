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
import { useZxing } from "react-zxing";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import ReasonCards from "./ReasonCards";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
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

  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedUserID = result.getText();
      setIsScanning(false);
      fetchStudentData(scannedUserID);
    },
    paused: !isScanning,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedReasons != "") {
      submitAttendance(studentID,selectedReasons);
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
          setStudentID(res.data.student.id);
          setShowReasons(true);
          setStudentName(res.data.student.first_name);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Student Not Found",
          text: "No student found with the provided ID number.",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setIsScanning(true);
        setLoading(false);
      });
  };
  const submitAttendance = (id,reason) => {

    setProgress(20); 
    const data = {
      user_id: id,
      notes : reason
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
        const Time = new Date(res.data.attendance.check_in).toLocaleTimeString();
        Swal.fire({
          title: message,
          html: `<h1>${Time}</strong>.</h1>`,
          icon: 'success',
        });
        setIsScanning(true);
        setStudentName('');
        setManualUserID('');
        setStudentID('');
        setShowReasons(false);
        setScanResult('');
        setSelectedReasons('');
        
        
       
        
        setTimeout(() => {
          setProgress(0);
        }, 1000);
      })

     
      .catch((err) => {
        Swal.fire({
          title: "You have already checked in and out for today",
          icon: 'error',
        });

        setIsScanning(true);
        setProgress(0); 
        setStudentName('');
        setManualUserID('');
        setStudentID('');
        setShowReasons(false);
        setScanResult('');
        setSelectedReasons('');
      
      }).finally(() => {
        setIsScanning(true);
        setProgress(0);
        setStudentName('');
        setManualUserID('');
        setStudentID('');
        setShowReasons(false);
        setScanResult('');
        setSelectedReasons('');
        

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

  const reasons = ["Study", "Borrow Book", "Return Book","Use Computer", "Research", "Other"];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Library Attendance System
        </Typography>

      

        {progress !== 0 ? (
        <Box width={500} sx={{ marginTop: 20 }}>
          <Typography variant="h6" sx={{textAlign:"center"}} gutterBottom>
          Uploading Attendance
        </Typography>
          <LinearProgressWithLabel value={progress} />
        </Box>
      ) : (
        !showReasons ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              position: "relative",
              boxShadow: 1,
            }}
          >
            <TextField
              label="Enter User ID manually Or Scan QR Code"
              variant="outlined"
              value={manualUserID}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{ marginTop: 0 }}
            />
            <video
              ref={ref}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {loading && <LinearProgress color="inherit" />}
          </Box>
        ) : (
          <Box>
            <Typography
              sx={{ textAlign: 'center', marginBottom: 5, marginTop: 5 }}
              variant="h5"
              gutterBottom
            >
              Hello {studentName}! Select reason for visit:
            </Typography>
            <ReasonCards
              reasons={reasons}
              handleReasonClick={handleReasonClick}
            />
          </Box>
        )
      )}

        <Typography variant="h4" sx={{ position: "fixed", bottom: 20 }}>
          {currentTime}
        </Typography>
      </Box>
    </Container>
  );
};

export default AttendanceSystem;

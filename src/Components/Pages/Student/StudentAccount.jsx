import React, { useRef, useState } from "react";
import {
  Typography,
  Grid,
  Avatar,
  Box,
  TextField,
  Button,
  Divider,
  Paper,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  MenuItem
} from "@mui/material";
import QRCode from "react-qr-code";
import { formatDate } from "../../../Utils/helper.jsx";
import { useAuth } from "../../Auth/AuthContext.jsx";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as CameraIcon,
  Download as DownloadIcon,
  Cancel as CancelIcon,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import Webcam from 'react-webcam';
import Swal from "sweetalert2";

const StudentAccount = () => {
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const qrBoxRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false
  });

  const handleTogglePassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  

  const handleInputChange = (field) => (event) => {
    setEditedData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
    setNewProfilePic(null);
  };

  
  const handleSave = () => {
    const userID = userData.id;
    updateUserData(editedData, userID)
      .then((updatedUserData) => {
        setIsEditing(false);
        if (updatedUserData.role === "admin") {
          navigate("/admin/account");
        } else if (updatedUserData.role === "student") {
          navigate("/student/account");
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: "Failed to update profile",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleImageChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
    
      const previewUrl = URL.createObjectURL(file);
      setNewProfilePic(previewUrl);
      console.log('previewUrl ',previewUrl);
      setEditedData(prev => ({
        ...prev,
        profile_picture: file
      }));
    }
  };

  const handleCameraCapture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setNewProfilePic(imageSrc);
      
      // Convert base64 to file
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
      
      console.log('profile_picture file:', file);
      handleImageChange('profile_picture', file);
      setShowCamera(false);
    }
  }, [webcamRef]);

  const downloadQRCode = () => {
    if (qrBoxRef.current) {
      html2canvas(qrBoxRef.current).then((canvas) => {
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${userData.id_number}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      });
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "grey.100", minHeight: "100vh" }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            {userData.role === "admin" ? "Account" : "Student"} Profile
          </Typography>
          {isEditing ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Stack>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4} lg={3}>
            <Card sx={{ textAlign: "center", position: "relative" }}>
              <CardContent>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Box position="relative" display="inline-block">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      isEditing && (
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            sx={{ bgcolor: "white" }}
                            onClick={() => fileInputRef.current.click()}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            sx={{ bgcolor: "white" }}
                            onClick={() => setShowCamera(true)}
                          >
                            <CameraIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      )
                    }
                  >
                    <Avatar
                      src={
                        newProfilePic ||
                        `http://127.0.0.1:8000/storage/${userData.profile_picture}`
                      }
                      sx={{
                        width: 150,
                        height: 150,
                        border: 3,
                        borderColor: "primary.main",
                        mb: 2,
                      }}
                    >
                      {userData.first_name[0]}
                      {userData.last_name[0]}
                    </Avatar>
                  </Badge>
                </Box>
                <Typography variant="h5" gutterBottom>
                  {isEditing ? (
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={editedData.first_name}
                        onChange={handleInputChange("first_name")}
                      />
                      <TextField
                        fullWidth
                        label="Middle Name"
                        value={editedData.middle_name}
                        onChange={handleInputChange("middle_name")}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={editedData.last_name}
                        onChange={handleInputChange("last_name")}
                      />
                    </Stack>
                  ) : (
                    `${userData.first_name} ${userData.middle_name} ${userData.last_name}`
                  )}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {userData.id_number}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" color="primary" gutterBottom>
                  {userData.course}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.year_level}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={userData.email}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={
                      isEditing
                        ? editedData.contact_number
                        : userData.contact_number
                    }
                    onChange={handleInputChange("contact_number")}
                    disabled={!isEditing}
                  />
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birthday"
                  value={isEditing ? dayjs(editedData.birthday) : dayjs(userData.birthday)}
                  disabled={!isEditing}
                  onChange={(newValue) => {
                    handleInputChange("birthday")({ 
                      target: { 
                        value: newValue ? newValue.format('YYYY-MM-DD') : null 
                      } 
                    });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                  format="MM/DD/YYYY"
                  maxDate={dayjs()} // Prevents future dates
                />
              </LocalizationProvider>
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    onChange={handleInputChange("gender")}
                    value={isEditing ? editedData.gender : userData.gender}
                    disabled={!isEditing}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Old Password"
                    type={showPasswords.oldPassword ? "text" : "password"}
                    onChange={handleInputChange("old_password")}
                    value={isEditing ? editedData.old_password : null}
                    disabled={!isEditing}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePassword("oldPassword")}
                            edge="end"
                            disabled={!isEditing}
                          >
                            {showPasswords.oldPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPasswords.newPassword ? "text" : "password"}
                    onChange={handleInputChange("new_password")}
                    value={isEditing ? editedData.new_password : null}
                    disabled={!isEditing}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePassword("newPassword")}
                            edge="end"
                            disabled={!isEditing}
                          >
                            {showPasswords.newPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* QR Code Section */}
          {userData.role === "student" && (
            <Grid item xs={12} md={12} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    Student ID Card
                  </Typography>
                  <Box
                    ref={qrBoxRef}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      py: 2,
                    }}
                  >
                    <QRCode value={userData.id_number} size={200} />
                    <Typography variant="h5" fontWeight="bold">
                      {userData.id_number}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadQRCode}
                    sx={{ mt: 2 }}
                  >
                    Download QR
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Camera Dialog */}
      {showCamera && (
        <Dialog
          open={showCamera}
          onClose={() => setShowCamera(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Take Photo</DialogTitle>
          <DialogContent>
            <Box sx={{ position: "relative", width: "100%", height: 400 }}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCamera(false)}>Cancel</Button>
            <Button onClick={handleCameraCapture} variant="contained">
              Capture
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default StudentAccount;
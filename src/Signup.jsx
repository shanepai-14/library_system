import React, { useState, useRef, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "./Utils/interceptor";
import { useAuth } from "./Components/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { styled } from '@mui/material/styles';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  AddAPhoto as AddPhotoIcon,
  PhotoCamera as CameraIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Cameraswitch as CameraSwitchIcon,
} from "@mui/icons-material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  padding: '8px 16px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.primary.light + '20',
  marginLeft: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '40',
    transform: 'translateY(-2px)',
  }
}));

const PhotoUpload = ({ onPhotoChange, error }) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);



  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handlePhotoSelect(file);
    }
  };

  const handlePhotoSelect = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    onPhotoChange(file);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setIsCameraOpen(false);
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const capture = useCallback(() => {
    setIsLoading(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "camera-photo.jpg", {
              type: "image/jpeg",
            });
            handlePhotoSelect(file);
          });
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    } finally {
      setIsLoading(false);
    }
  }, [webcamRef]);

  return (
    <Box sx={{ textAlign: "center", mb: 0 }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
        id="photo"
        name="photo"
      />

      <Badge
        badgeContent={preview ? "1" : "0"}
        color="primary"
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Tooltip title={preview ? "Change photo" : "Add photo"}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              width: 200,
              height: 200,
              border: (theme) =>
                `2px dashed ${
                  error ? theme.palette.error.main : theme.palette.primary.main
                }`,
              borderRadius: "50%",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <AddPhotoIcon sx={{ fontSize: 40 }} />
            )}
          </IconButton>
        </Tooltip>
      </Badge>

      {error && (
        <Typography
          color="error"
          variant="caption"
          display="block"
          sx={{ mt: 1 }}
        >
          {error}
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isCameraOpen ? "Take a Photo" : "Choose Photo Option"}
          <IconButton onClick={handleClose} sx={{ color: "grey.500" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {isCameraOpen ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  backgroundColor: "#000",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover"
                  }}
                />

                <IconButton
                  onClick={toggleCamera}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)",
                    },
                    color: "white",
                  }}
                >
                  <CameraSwitchIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={capture}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={20} /> : <CameraIcon />
                  }
                >
                  {isLoading ? "Capturing..." : "Capture Photo"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setIsCameraOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                p: 3,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                onClick={() => setIsCameraOpen(true)}
                size="large"
              >
                Take Photo
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                size="large"
              >
                Upload Photo
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const BackgroundContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/library.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.7,
    zIndex: -2
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    zIndex: -1
  }
});
export default function SignUp() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    // Create a new FormData object to send to the server
    const formData = new FormData();
    
    // Separate required and optional fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'password', 
      'course', 'yearLevel', 'contactNumber', 'gender', 'passwordConfirmation',
      'birthday'
    ];
    
    const optionalFields = ['middleName'];
    
    const errors = {};
    
    // Validate required fields
    requiredFields.forEach(field => {
      const value = data.get(field);
      if (!value) {
        errors[field] = 'This field is required';
      } else {
        formData.append(field.replace(/([A-Z])/g, "_$1").toLowerCase(), value);
      }
    });
  
    // Handle optional fields
    optionalFields.forEach(field => {
      const value = data.get(field);
      if (value) {
        formData.append(field.replace(/([A-Z])/g, "_$1").toLowerCase(), value);
      }
    });
  
    // Handle the photo file separately
    const photoFile = event.currentTarget.querySelector('#photo').files[0];
    if (photoFile) {
      formData.append('profile_picture', photoFile);
    } else {
      errors.photo = 'Profile picture is required';
    }
  
    setFormErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      console.log(formData);
      api
        .post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const userRole = response.data.user.role;
          setLoading(false);
          Swal.fire({
            title: "Success!",
            text: "Your account has been created successfully.",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              auth(response);
              if (userRole === "student") {
                navigate("/student/dashboard");
              } else {
                console.error("Unexpected user role:", userRole);
                navigate("/unauthorized");
              }
            }
          });
        })
        .catch((error) => {
          setLoading(false);
          
          // Check if it's a validation error response
          if (error.response?.data?.errors) {
            const errorMessages = error.response.data.errors;
            
            // Check specifically for email error
            if (errorMessages.email?.includes('has already been taken')) {
              Swal.fire({
                title: "Email Already Registered",
                text: "This email address is already registered. Please try logging in or use a different email.",
                icon: "warning",
                confirmButtonText: "OK",
                showCancelButton: true,
                cancelButtonText: "Go to Login",
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  navigate('/'); // Navigate to login page
                }
              });
            } else {
              // Handle other validation errors
              const firstError = Object.values(errorMessages)[0]?.[0] || "Please check your input";
              Swal.fire({
                title: "Validation Error",
                text: firstError,
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          } else {
            // Handle non-validation errors
            Swal.fire({
              title: "Error",
              text: error.response?.data?.message || "An error occurred during signup",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      // Show validation errors in Swal
      Swal.fire({
        title: "Required Fields Missing",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <BackgroundContainer>
    

    <Container maxWidth="md">
    <Paper
          elevation={6} // Increased elevation for better contrast with background
          sx={{
            p: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white
            backdropFilter: 'blur(10px)', // Blur effect for modern look
          }}
        >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 1,
          }}
        >
            
          <Avatar
            src="/dvclogo.png"
            sx={{ m: 1, height: 70, width: 70 }}
          ></Avatar>
          <Typography component="h1" variant="h5" color="primary">
            <LocalLibraryIcon fontSize="inherit" /> Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="middleName"
                  label="Middle Name"
                  name="middleName"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  required
                  fullWidth
                  name="birthday"
                  type="date"
                  id="birthday"
                  label="Birthday"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!formErrors.birthday}
                  helperText={formErrors.birthday}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!formErrors.gender}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {formErrors.gender && <Typography color="error" variant="caption">{formErrors.gender}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirmation"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  error={!!formErrors.passwordConfirmation}
                  helperText={formErrors.passwordConfirmation}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "center", mb: 0 }}
              >
                <PhotoUpload
                  onPhotoChange={(file) => {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    const photoInput = document.querySelector("#photo");
                    if (photoInput) {
                      photoInput.files = dataTransfer.files;
                    }
                  }}
                  error={formErrors.photo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  sx={{ mb: 2 }}
                  fullWidth
                  required
                  error={!!formErrors.course}
                >
                  <InputLabel id="course-label">Course</InputLabel>
                  <Select
                    labelId="course-label"
                    id="course"
                    name="course"
                    label="Course"
                  >
                    <MenuItem value="BSIT">
                      Bachelor of Science in Information Technologoy
                    </MenuItem>
                    <MenuItem value="BEED">
                      Bachelor in Elementary Education
                    </MenuItem>
                    <MenuItem value="BSED-ENG">
                      Bachelor of Secondary Education Major In English
                    </MenuItem>
                    <MenuItem value="BSED-MATH">
                      Bachelor of Secondary Education Major In Math
                    </MenuItem>
                    <MenuItem value="THEO">Theology</MenuItem>
                    <MenuItem value="SHS">SENIOR HIGH</MenuItem>
                  </Select>
                  {formErrors.course && (
                    <Typography color="error" variant="caption">
                      {formErrors.course}
                    </Typography>
                  )}
                </FormControl>

                <FormControl
                  sx={{ mb: 2 }}
                  fullWidth
                  required
                  error={!!formErrors.yearLevel}
                >
                  <InputLabel id="year-level-label">Year Level</InputLabel>
                  <Select
                    labelId="year-level-label"
                    id="yearLevel"
                    name="yearLevel"
                    label="Year Level"
                  >
                    <MenuItem value="1st Year">1st Year</MenuItem>
                    <MenuItem value="2nd Year">2nd Year</MenuItem>
                    <MenuItem value="3rd Year">3rd Year</MenuItem>
                    <MenuItem value="4th Year">4th Year</MenuItem>
                    <MenuItem value="Grade 11">Grade 11</MenuItem>
                    <MenuItem value="Grade 12">Grade 12</MenuItem>
                  </Select>
                  {formErrors.yearLevel && (
                    <Typography color="error" variant="caption">
                      {formErrors.yearLevel}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  required
                  fullWidth
                  name="contactNumber"
                  label="Contact Number"
                  type="tel"
                  id="contactNumber"
                  error={!!formErrors.contactNumber}
                  helperText={formErrors.contactNumber}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <FormControlLabel
                  required
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I agree to these Terms and Conditions"
                />
              </Grid> */}
            </Grid>
            <LoadingButton
              sx={{ mt: 3, mb: 2 }}
              fullWidth
              type="submit"
              endIcon={<LoginIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              <span>SIGN UP</span>
            </LoadingButton>
            <Grid container justifyContent="flex-end">
               <Grid item>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 0,
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Already have an account?
                      </Typography>
                      <StyledLink to='/'>
                        <PersonAddIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                         Sign in
                        </Typography>
                      </StyledLink>
                    </Box>
                  </Grid>

            </Grid>
          </Box>
        </Box>
        </Paper>
      </Container>
      </BackgroundContainer>
  );
}

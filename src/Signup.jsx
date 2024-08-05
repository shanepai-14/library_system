import React ,{useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Copyright from './Components/Layout/Copyright';
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LoadingButton from '@mui/lab/LoadingButton';
import api from './Utils/interceptor';
import { useAuth } from './Components/Auth/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
export default function SignUp() {

  const { auth } = useAuth(); 
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('');


  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    // Create a new FormData object to send to the server
    const formData = new FormData();
    
    const fields = [
      'firstName', 'middleName', 'lastName', 'email', 'password', 
      'course', 'yearLevel', 'contactNumber', 'gender','passwordConfirmation'
    ];
    
    const errors = {};
    
    fields.forEach(field => {
      const value = data.get(field);
      if (!value) {
        errors[field] = 'This field is required';
      } else {
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
      console.log(Object.fromEntries(formData));
  
      api.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {

        const userRole = response.data.user.role; 
        setLoading(false);
        Swal.fire({
          title: 'Success!',
          text: 'Your account has been created successfully.',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            auth(response)
            if (userRole === 'student') {
              navigate('/student/dashboard');
            } else {
              // Handle unexpected role
              console.error('Unexpected user role:', userRole);
              navigate('/unauthorized');
            }
          }
        });

      })
      .catch((error) => {
        console.error('Error creating user:', error);
        setLoading(false);
        setApiError(error.response?.data?.message || 'An error occurred during signup');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };
  return (
      <div style={{ width:"100%",height:"auto",margin:"auto", 
      position:"relative",
 
    }}
      >
 <div
    style={{
      position: 'fixed',
      backgroundImage: 'url("/dvc.jpg")', 
      backgroundSize: 'cover',
      opacity:0.4,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    }}
  />
     
      <Container component="main" maxWidth="md" sx={{zIndex:999, 
        backgroundColor:'white',
        marginTop:6, 
        boxShadow: 2,
        borderRadius:1 ,
        paddingBottom:4,
        paddingTop:4
        }}>
        <CssBaseline />
        <Box
          sx={{

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
           
            opacity: 1,
           
            
          }}
        >
          <Avatar  src='/dvclogo.png' sx={{ m: 1, height:70 ,width:70 }}>
          </Avatar> 
          <Typography component="h1" variant="h5"  color="primary">
          <LocalLibraryIcon fontSize="inherit"/>  Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  error={!!formErrors.middleName}
                  helperText={formErrors.middleName}
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
              <Grid item xs={12}>
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
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!formErrors.course}>
                  <InputLabel id="course-label">Course</InputLabel>
                  <Select
                    labelId="course-label"
                    id="course"
                    name="course"
                    label="Course"
                  >
                    <MenuItem value="BSIT">Bachelor of Science in Information Technologoy</MenuItem>
                    <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
                    <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
                    <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
                    <MenuItem value="THEO">Theology</MenuItem>
                  </Select>
                  {formErrors.course && <Typography color="error" variant="caption">{formErrors.course}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!formErrors.yearLevel}>
                  <InputLabel id="year-level-label">Year Level</InputLabel>
                  <Select
                    labelId="year-level-label"
                    id="yearLevel"
                    name="yearLevel"
                    label="Year Level"
                  >
                    <MenuItem value="1st Year">1st Year</MenuItem>
                    <MenuItem value="2nd Yea">2nd Year</MenuItem>
                    <MenuItem value="3rd Year">3rd Year</MenuItem>
                    <MenuItem value="4th Year">4th Year</MenuItem>
                    <MenuItem value="Grade 11">Grade 11</MenuItem>
                    <MenuItem value="Grade 12">Grade 12</MenuItem>
                  </Select>
                  {formErrors.yearLevel && <Typography color="error" variant="caption">{formErrors.yearLevel}</Typography>}
                </FormControl>
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="photo"
                  type="file"
                  id="photo"
                  inputProps={{ accept: "image/*" }}
                  error={!!formErrors.photo}
                  helperText={formErrors.photo}
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <FormControlLabel
                  required
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I agree to these Terms and Conditions"
                />
              </Grid>
            </Grid>
            <LoadingButton
                sx={{ mt: 3, mb: 2 }}
                fullWidth
               type="submit"
                endIcon={< LoginIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
        >
          <span>SIGN UP</span>
        </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
     
      </Container>
      <Copyright sx={{ mt: 5 }} />
      </div>
  );
}
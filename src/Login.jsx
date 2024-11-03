import  React ,{useState, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import LibraryHoursCard from './Components/Tables/LibraryHoursCard.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import  api  from './Utils/interceptor.jsx'
import { login, latestPost } from './Utils/endpoint';
import { useAuth } from './Components/Auth/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import AnnouncementCard from './Components/Layout/AnnouncementCard.jsx';
import { styled } from '@mui/material/styles';

// TODO remove, this demo shouldn't need to reset the theme.
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


const defaultTheme = createTheme();

export default function App() {


  const { auth } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState('');
  const [post, setPost] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    fetchPost()
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();
  const handleSubmit =  (event) => {
    event.preventDefault();
   setLoading(true);

    const data = {
        "email" : email,
        "password" : password
    }

    api
      .post(login(), data)
      .then((response) => {
        auth(response)
        const userRole = response.data.user.role; 
        setLoading(false);

        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'student') {
          navigate('/student/dashboard');
        } else {
          // Handle unexpected role
          console.error('Unexpected user role:', userRole);
          navigate('/unauthorized');
        }
   

      })
      .catch((error) => {
        setResult(error.response.data.message);
        setError(true);
        if (
          error.response?.status === "401" ||
          error.response?.status === 401
        ) {
          console.log("Invalid Username or password.");
        } else {
          console.log("Something went wrong. Please try again.");
        }
        setLoading(false);
      });
};

const fetchPost = async () => {
  try {
    const response = await api.get(latestPost());
    const res = response.data;
    setPost(res);
  } catch (error) {
    console.error('Error fetching post:', error);
  }
};

const handleChangePass = (event) => {
  setPassword(event.target.value);
};
const handleChangeEmail = (event) => {
  setEmail(event.target.value);
};

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
  item
  xs={false}
  sm={4}
  md={7}
  sx={{
    position: 'relative', // Add this to position the overlay correctly
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundImage: 'url("/library.jpg")',
    backgroundColor: (t) =>
      t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'right',
  }}
>
  {/* Overlay */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', // Black background with opacity
      zIndex: 1,
    }}
  />
  
  {/* Content */}
  <Box
    sx={{
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {/* <QuoteCard /> */}
     {post &&  <AnnouncementCard announcement={post} deleteView={false}/>}
    <Typography
      color={'white'}
      variant="h1"
      sx={{
        mt: 5,
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "4rem",
        letterSpacing: "0.1em",
        fontWeight: "bold",
      }}
    >
      {currentDate}
    </Typography>
    <Typography
      color={'white'}
      variant="h1"
      sx={{
        mt: 3,
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "4rem",
        letterSpacing: "0.1em",
        fontWeight: "bold",
      }}
    >
      {currentTime}
    </Typography>
  </Box>
</Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: 5,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
             
            }}
          >
            <Avatar src='/dvclogo.png'  sx={{ m: 1,height:70 ,width:70 }}>
            </Avatar>
            <Typography component="h1" variant="h4" color="primary">
            <LocalLibraryIcon fontSize="inherit"/> Library Management System
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChangeEmail}
                value={email}
                error={error}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChangePass}
                value={password}
                error={error}
                helperText={result ?? ""}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
       
              <LoadingButton
                sx={{ mt: 3, mb: 2 }}
                fullWidth
               type="submit"
                endIcon={< LoginIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
        >
          <span>LOGIN</span>
        </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                 
                  </Link>
                </Grid>
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
                        Don't have an account?
                      </Typography>
                      <StyledLink to='/signup'>
                        <PersonAddIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Sign Up
                        </Typography>
                      </StyledLink>
                    </Box>
                  </Grid>
              </Grid>
              <LibraryHoursCard/>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
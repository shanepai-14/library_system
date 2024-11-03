import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

// Custom styled components
const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  borderRadius: '50%',
  padding: theme.spacing(3),
  display: 'inline-flex',
  marginBottom: theme.spacing(3)
}));

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

const Unauthorized = () => {
  return (
    <BackgroundContainer>
      <Container maxWidth="sm">
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
          <IconWrapper>
            <LockIcon 
              sx={{ 
                fontSize: 64,
                color: 'error.main'
              }} 
            />
          </IconWrapper>

          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Unauthorized Access
          </Typography>

          <Alert 
            severity="error" 
            sx={{ mb: 4, textAlign: 'left', width: '100%' }}
          >
            <AlertTitle>Access Denied</AlertTitle>
            You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </Alert>

          <Button
            variant="contained" // Changed to contained for better visibility
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    </BackgroundContainer>
  );
};

export default Unauthorized;
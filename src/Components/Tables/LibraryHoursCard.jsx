import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  Tooltip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600, // Increased max-width for side-by-side layout
  margin: 'auto',
  marginTop: 0,
  boxShadow:'none',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const TimeDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  flex: 1,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const LibraryHoursCard = () => {
  return (
    <Tooltip 
      title="Click to view attendance page" 
      arrow
      placement="top"
    >
      <StyledCard elevation={4}>
        <CardContent
          component={Link}
          to={'/attendance'}
          sx={{
            textDecoration: 'none',
            padding: 3,
            '&:last-child': { paddingBottom: 3 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2 
          }}>
            <Typography 
              color="primary" 
              variant="h4" 
              component="div" 
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.8rem', sm: '2.2rem' }
              }}
            >
              Library Hours
            </Typography>
            <TouchAppIcon 
              color="primary" 
              sx={{ ml: 1, animation: 'bounce 1s infinite' }}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TimeDisplay>
              <AccessTimeIcon 
                sx={{ 
                  mb: 1,
                  color: 'success.main',
                  fontSize: 35
                }} 
              />
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                gutterBottom
              >
                Opening Time
              </Typography>
              <Typography 
                variant="h5" 
                color="success.main"
                sx={{ fontWeight: 'medium' }}
              >
                9:00 AM
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Monday - Friday
              </Typography>
            </TimeDisplay>

            <TimeDisplay>
              <AccessTimeIcon 
                sx={{ 
                  mb: 1,
                  color: 'error.main',
                  fontSize: 35
                }} 
              />
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                gutterBottom
              >
                Closing Time
              </Typography>
              <Typography 
                variant="h5" 
                color="error.main"
                sx={{ fontWeight: 'medium' }}
              >
                5:00 PM
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Monday - Friday
              </Typography>
            </TimeDisplay>
          </Box>
        </CardContent>
      </StyledCard>
    </Tooltip>
  );
};

// Add bounce animation
const styles = `
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LibraryHoursCard;
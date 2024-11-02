import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';

const LibraryHoursCard = () => {
  return (
    <Card 
    
    sx={{ maxWidth: 400, m: "auto", marginTop:2, backgroundColor:"#F1FAFF",}}>
      <CardContent
        component={Link}
        to={'/attendance'}
        sx={{textDecoration:'none'}}
      >
        <Typography color="primary" variant="h4" align='center' component="div" gutterBottom>
          Library Hours
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <AccessTimeIcon sx={{ mr: 1 }} fontSize="medium"  color="success" />
          <Typography variant="body1" color="primary" fontSize={20}>
            Open: 9:00 AM
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <AccessTimeIcon sx={{ mr: 1 }} fontSize="medium"  color="error" />
          <Typography variant="body1" color="primary" fontSize={20} >
            Close: 5:00 PM
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LibraryHoursCard;
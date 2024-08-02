import React from 'react';
import { Grid, Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import {
  MenuBook,
  ArrowForward,
} from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleIcon from '@mui/icons-material/Article';
import ComputerIcon from '@mui/icons-material/Computer';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
// Map reasons to icons
const reasonIcons = {
  'Study': MenuBook,
  'Borrow Book': ArrowBackIcon,
  'Return Book': ArrowForward,
  'Research': ArticleIcon,
  'Use Computer': ComputerIcon,
  'Other' :QuestionAnswerIcon
  // Add more mappings as needed
};

const ReasonCards = ({ reasons, handleReasonClick }) => {
  const getIcon = (reason) => {
    const IconComponent = reasonIcons[reason] || More;
    return <IconComponent fontSize="large" />;
  };

  return (
    <Grid container  spacing={4}>
      {reasons.map((reason) => (
        <Grid item xs={12} sm={6} md={4} key={reason}>
          <Card sx={{ bgcolor: 'primary.main',color:"white" }}>
            <CardActionArea onClick={() => handleReasonClick(reason)}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" height={70} >
                  {getIcon(reason)}
                  <Typography variant="h6" component="div" ml={2}>
                    {reason}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReasonCards;
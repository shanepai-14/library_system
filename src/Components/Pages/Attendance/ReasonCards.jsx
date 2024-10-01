import React, { useState } from 'react';
import { Grid, Card, CardActionArea, CardContent, Box, Typography, TextField, Button } from '@mui/material';
import { MenuBook, ArrowBack as ArrowBackIcon, ArrowForward, Article as ArticleIcon, Computer as ComputerIcon, QuestionAnswer as QuestionAnswerIcon, MoreHoriz as More } from '@mui/icons-material';

const reasonIcons = {
  'Study': MenuBook,
  'Borrow Book': ArrowBackIcon,
  'Return Book': ArrowForward,
  'Research': ArticleIcon,
  'Use Computer': ComputerIcon,
  'Other': QuestionAnswerIcon
  // Add more mappings as needed
};

const ReasonCards = ({ reasons, handleReasonClick }) => {
  const [otherReason, setOtherReason] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const getIcon = (reason) => {
    const IconComponent = reasonIcons[reason] || More;
    return <IconComponent fontSize="large" />;
  };

  const handleCardClick = (reason) => {
    if (reason === 'Other') {
      setShowOtherInput(true);
    } else {
      handleReasonClick(reason);
    }
  };

  const handleOtherReasonSubmit = () => {
    if (otherReason.trim()) {
      handleReasonClick("Other : " + otherReason);
      setOtherReason('');
      setShowOtherInput(false);
    }
  };

  return (
    <Grid container spacing={4}>
      {reasons.map((reason) => (
        <Grid item xs={12} sm={6} md={4} key={reason}>
          <Card sx={{ bgcolor: 'primary.main', color: "white" }}>
            <CardActionArea onClick={() => handleCardClick(reason)}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" height={70}>
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
      {showOtherInput && (
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
              variant="outlined"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Enter other reason"
              sx={{ mr: 2, bgcolor: 'background.paper' }}
            />
            <Button variant="contained" onClick={handleOtherReasonSubmit}>
              Submit
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ReasonCards;
import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  Box, 
  Typography, 
  TextField, 
  Button,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { 
  MenuBook, 
  ArrowBack as ArrowBackIcon, 
  ArrowForward, 
  Article as ArticleIcon, 
  Computer as ComputerIcon, 
  QuestionAnswer as QuestionAnswerIcon, 
  MoreHoriz as More,
  Close as CloseIcon 
} from '@mui/icons-material';

const reasonIcons = {
  'Study': MenuBook,
  'Borrow Book': ArrowBackIcon,
  'Return Book': ArrowForward,
  'Research': ArticleIcon,
  'Use Computer': ComputerIcon,
  'Other': QuestionAnswerIcon
};

const ReasonCards = ({ reasons, onSubmit }) => {
  const [selectedReasons, setSelectedReasons] = useState(new Set());
  const [otherReason, setOtherReason] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);


  const getIcon = (reason) => {
    const IconComponent = reasonIcons[reason] || More;
    return <IconComponent fontSize="large" />;
  };

  const handleCardClick = (reason) => {
    if (reason === 'Other') {
      setShowOtherInput(true);
      return;
    }

    setSelectedReasons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reason)) {
        newSet.delete(reason);
      } else {
        newSet.add(reason);
      }
      return newSet;
    });
  };

  const handleOtherReasonSubmit = () => {
    if (otherReason.trim()) {
      const customReason = `Other: ${otherReason}`;

      setSelectedReasons(prev => new Set(prev).add(customReason));
      setOtherReason('');
      setShowOtherInput(false);
    }
  };

  const handleRemoveReason = (reason) => {
    setSelectedReasons(prev => {
      const newSet = new Set(prev);
      newSet.delete(reason);
      return newSet;
    });
    

  };

  const handleSubmit = () => {
    if (selectedReasons.size > 0) {
      // Convert Set to Array, then to comma-separated string
      const reasonsString = Array.from(selectedReasons).join(', ');
      onSubmit(reasonsString);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 'lg', mx: 'auto' }}>
      <Grid container spacing={4}>
        {reasons.map((reason) => {
          const isSelected = selectedReasons.has(reason);
          return (
            <Grid item xs={12} sm={6} md={4} key={reason}>
              <Card 
                sx={{ 
                  bgcolor: isSelected ? 'primary.main' : '#f6f6f6',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                <CardActionArea onClick={() => handleCardClick(reason)}>
                  <CardContent>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center" 
                      height={60}
                      sx={{ color: isSelected ? 'white' : 'text.primary' }}
                    >
                      {getIcon(reason)}
                      <Typography variant="h6" component="div" ml={2}>
                        {reason}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {showOtherInput && (
        <Box mt={4} display="flex" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Enter other reason"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleOtherReasonSubmit();
              }
            }}
          />
          <Button variant="contained" onClick={handleOtherReasonSubmit}>
            Add
          </Button>
          <Button variant="outlined" onClick={() => setShowOtherInput(false)}>
            Cancel
          </Button>
        </Box>
      )}

      {selectedReasons.size > 0 && (
        <Box mt={4} sx={{display:'flex', justifyContent:"space-between"}}>
          <Box>
          <Typography variant="h6" gutterBottom>
            Selected Reasons:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {Array.from(selectedReasons).map((reason) => (
              <Chip
                key={reason}
                label={reason}
                onDelete={() => handleRemoveReason(reason)}
                deleteIcon={<CloseIcon />}
                color="primary"
              />
            ))}
              
          </Stack>
          </Box>
          <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={selectedReasons.size === 0}
        >
          Submit
        </Button>
        </Box>
      )}

      <Divider sx={{ mt:2 }} />

     
    </Box>
  );
};

export default ReasonCards;
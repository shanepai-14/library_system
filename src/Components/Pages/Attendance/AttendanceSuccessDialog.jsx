import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import { 
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  BookmarkBorder as BookmarkIcon,
  Category as CategoryIcon,
  LocalLibrary as LibraryIcon
} from '@mui/icons-material';
import noImage from "../../../../src/assets/No-Image-Placeholder.svg"

const AttendanceSuccessDialog = ({ open, onClose, data }) => {

  if (!data) return null;

  const { message, attendance, student, recommended_books } = data;
  const checkInTime = new Date(attendance.check_in).toLocaleTimeString();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <Box sx={{ position: 'relative', bgcolor: 'background.paper' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            {message}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {/* Check-in Time and Student Info */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AccessTimeIcon fontSize="large" />
                    <Box>
                      <Typography variant="body2">Check-in Time</Typography>
                      <Typography variant="h4">{checkInTime}</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: 'grey.100', p: 2 }}>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon color="primary" />
                      <Typography>{student.name}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SchoolIcon color="primary" />
                      <Typography>{`${student.course} - ${student.year_level}`}</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Recommended Books Section */}
          {recommended_books && recommended_books.length > 0 && (
            <>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3 }}>
                Recommended Books for Your Course
              </Typography>
              <Grid container spacing={3}>
                {recommended_books.map((book) => (
                  <Grid item xs={12} sm={6} key={book.id}>
                    <Card sx={{ display: 'flex', height: '100%' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 140 }}
                        image={book.image ? `http://127.0.0.1:8000/storage/${book.image}` : noImage}
                        alt={book.title}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {book.title}
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <BookmarkIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{book.isbn}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CategoryIcon fontSize="small" color="primary" />
                            <Typography variant="body2">
                              {`${book.category?.name} (Shelf: ${book.category?.shelve_no})`}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LibraryIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="success.main">
                              {`${book.available_copies} of ${book.total_copies} copies available`}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Related Subjects:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                            {book.subjects.map((subject) => (
                              <Chip
                                key={subject.id}
                                label={subject.code}
                                size="small"
                                sx={{ mb: 1 }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AttendanceSuccessDialog;
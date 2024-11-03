import React, { useEffect, useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  Category as CategoryIcon,
  LocalLibrary as LibraryIcon,
  BookmarkBorder as BookmarkIcon
} from '@mui/icons-material';
import api from '../../Utils/interceptor';
import { getRecommendedBooks } from '../../Utils/endpoint';
import noImage from '../../assets/No-Image-Placeholder.svg'

const WelcomeDialog = ({ open, onClose, userData }) => {
  const [loading, setLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    if (open && userData && userData.role === 'student') {
      setLoading(true);
      api.get(getRecommendedBooks(userData.id))
        .then(response => {
          setRecommendedBooks(response.data.recommended_books);
        })
        .catch(error => {
          console.error('Error fetching recommended books:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userData]);

  if (!userData) return null;

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
            Welcome, {userData.first_name}!
          </Typography>
        </DialogTitle>

        <DialogContent>
          {userData.role === 'student' && (
            <>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Recommended Books for Your Course
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : recommendedBooks.length > 0 ? (
                <Grid container spacing={3}>
                  {recommendedBooks.map((book) => (
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
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No recommended books available for your course at the moment.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default WelcomeDialog;

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Language as LanguageIcon,
  DateRange as DateRangeIcon,
  LocalLibrary as LibraryIcon,
  AttachMoney as MoneyIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import noImage from '../../assets/No-Image-Placeholder.svg'

const BookDetailsModal = ({ open, onClose, book }) => {
  if (!book) return null;

  const InfoRow = ({ icon, label, value, chip }) => (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {chip ? (
          <Chip
            label={value}
            size="small"
            color={value === 'Available' ? 'success' : 'error'}
            sx={{ mt: 0.5 }}
          />
        ) : (
          <Typography variant="body1">{value || 'Not specified'}</Typography>
        )}
      </Box>
    </Box>
  );

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
            color: 'grey.500',
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            Book Details
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Left Column - Book Image */}
            <Grid item xs={12} md={6}>
              <Card elevation={0}>
                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    maxHeight: 400,
                    objectFit: 'cover'
                  }}
                  image={`http://127.0.0.1:8000/storage/${book.image}`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = noImage; // Fallback image
                  }}
                />
              </Card>

              <Box mt={2}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2,
                    borderRadius: 2
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip
                      label={book.available_copies > 0 ? 'Available' : 'Borrowed'}
                      size="small"
                      color={book.available_copies > 0 ? 'success' : 'error'}
                      sx={{ color: 'white' }}
                    />
                  </Stack>
                  <Box mt={1}>
                    <Typography variant="caption" component="div">
                      Available Copies: {book.available_copies} / {book.total_copies}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>

            {/* Right Column - Book Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>

              <Box mb={3}>
                <InfoRow
                  icon={<PersonIcon color="primary" />}
                  label="Author"
                  value={book.author}
                />

                <InfoRow
                  icon={<BookmarkIcon color="primary" />}
                  label="ISBN"
                  value={book.isbn}
                />

                <InfoRow
                  icon={<CategoryIcon color="primary" />}
                  label="Category"
                  value={`${book.category} (Shelf: ${book.shelve_no})`}
                />

                <InfoRow
                  icon={<LanguageIcon color="primary" />}
                  label="Language"
                  value={book.language}
                />

                <InfoRow
                  icon={<DateRangeIcon color="primary" />}
                  label="Publication Year"
                  value={book.publication_year}
                />

                <InfoRow
                  icon={<MoneyIcon color="primary" />}
                  label="Price"
                  value={`₱${parseFloat(book.book_price).toLocaleString()}`}
                />

              </Box>

              {book.description && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="primary">
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.description == null ? book.description : 'None'}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />
              
              {/* Additional Details */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Added on {new Date(book.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Last updated {new Date(book.updated_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default BookDetailsModal;


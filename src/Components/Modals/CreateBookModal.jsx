import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Paper
} from "@mui/material";
import { allAuthors, allCategories, allSubjects } from "../../Utils/endpoint";
import FileInput from "../Layout/FileInput";
import api from "../../Utils/interceptor";
import Swal from "sweetalert2";


const CreateBook = ({ open, handleClose, handleCreate }) => {
  const initialData = {
    title: "",
    book_price: "",
    total_copies: "",
    isbn: "",
    publication_year: "",
    author_id: "",
    category_id: "",
    image: null,
    subject_ids: [], // For multiple subjects
  };

  const [formData, setFormData] = useState(initialData);
  const [fileName, setFileName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAuthors();
      fetchCategories();
      fetchSubjects();
    }
  }, [open]);

  const fetchAuthors = () => {
    api.get(allAuthors())
      .then((res) => {
        setAuthors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching authors:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch authors. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const fetchCategories = () => {
    api.get(allCategories())
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch categories. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const fetchSubjects = () => {
    api.get(allSubjects())
      .then((res) => {
        setSubjects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch subjects. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubjects(newValue);
    setFormData(prev => ({
      ...prev,
      subject_ids: newValue.map(subject => subject.id)
    }));
  };

  const groupSubjectsByDepartment = (subjects) => {
    return subjects.reduce((acc, subject) => {
      const dept = subject.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(subject);
      return acc;
    }, {});
  };

  const handleSubmit = () => {
    // Pass the formData directly to handleCreate
    handleCreate(formData);
    handleClose();
    setFormData(initialData);
    setFileName("");
    setSelectedSubjects([]);
  };




  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-book-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1200,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" mb={3} fontWeight="bold">
          Create New Book
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column - Basic Information */}
          <Grid item xs={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" mb={3}>
                Basic Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Publication Year"
                    name="publication_year"
                    type="number"
                    value={formData.publication_year}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="book_price"
                    type="number"
                    value={formData.book_price}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Total Copies"
                    name="total_copies"
                    type="number"
                    value={formData.total_copies}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Author</InputLabel>
                    <Select
                      name="author_id"
                      value={formData.author_id}
                      onChange={handleInputChange}
                      label="Author"
                      required
                    >
                      {authors.map((author) => (
                        <MenuItem key={author.id} value={author.id}>
                          {author.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      label="Category"
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <FileInput
                      onChange={handleFileChange}
                      fileName={fileName}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Subject Selection */}
          <Grid item xs={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" mb={3}>
                Recommended Subjects
              </Typography>
              
              <Autocomplete
                multiple
                options={subjects}
                value={selectedSubjects}
                onChange={handleSubjectChange}
                groupBy={(option) => option.department}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Subjects"
                    placeholder="Search subjects..."
                    variant="outlined"
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={`${option.code} - ${option.name}`}
                      {...getTagProps({ index })}
                      sx={{ 
                        m: 0.5,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      }}
                    />
                  ))
                }
                renderOption={(props, option) => (
                  
                  <Box component="li" {...props} sx={{ p: 2 }}>
               
                      <Typography variant="subtitle1" fontWeight="medium">
                        {`${option.code} - ${option.name}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Year {option.year_level} | {option.department} | {option.semester} Semester
                      </Typography>
                    </Box>
             
                )}
                sx={{ height: '100%' }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{ px: 4 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ px: 4 }}
          >
            Create Book
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};


export default CreateBook;
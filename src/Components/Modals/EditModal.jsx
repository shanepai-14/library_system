import React, { useState, useEffect, useCallback } from "react";
import {  
  allAuthors,
  allCategories,
  getBooks,
  getUsers,
  showUser,
  showBook , allSubjects} from "../../Utils/endpoint";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  FormControl,
  Autocomplete,
  CircularProgress,
  MenuItem,
  Paper,
  Chip

} from "@mui/material";
import debounce from "lodash/debounce";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { capitalizeFirstLetter, getInputType } from "../../Utils/helper";
import FileInput from "../Layout/FileInput";
import api from "../../Utils/interceptor";
import noImage from "../../../src/assets/No-Image-Placeholder.svg"
import Swal from "sweetalert2";
import dayjs from 'dayjs';


const EditModal = ({
  open,
  handleClose,
  rowData,
  handleSave,
  editableColumns,
  title,
}) => {
  const [editedData, setEditedData] = useState(
    editableColumns.reduce(
      (acc, col) => ({ ...acc, [col]: rowData[col] || "" }),
      {}
    )
  );

  const [fileName, setFileName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [optionsUser, setOptionsUser] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    setFileName("");
    setSelectedUser(null);
    setSelectedBook(null);
    setDueDate(null);

    if (title === "Edit Book") {
      fetchAuthors();
      fetchCategory();
      fetchSubjects();
      
      // Set initial selected subjects if they exist
      if (rowData.subjects_info) {
        setSelectedSubjects(rowData.subjects_info);
        setEditedData(prev => ({
          ...prev,
          subject_ids: rowData.subjects_info.map(subject => subject.id)
        }));
      }
    }

    if (title === "Issue Book") {
      fetchUsers('all');
      fetchBooks('all');
      fetchCurrentBook(editedData.book_id);
      fetchCurrentUser(editedData.user_id);
    }
  }, [rowData]);

  const fetchCurrentBook = (id) => {
    api.get(showBook(id))
      .then((res) => {
        setSelectedBook(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchCurrentUser = (id) => {
    api.get(showUser(id))
      .then((res) => {
        setSelectedUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchCategory = () => {
    api.get(allCategories())
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchAuthors = () => {
    api.get(allAuthors())
      .then((res) => {
        setAuthors(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchBooks = (search) => {
    if (!search) {
      setOptions([]);
      return;
    }
    setLoading(true);

    const params = {
      page: 1,
      row: 15,
      search: search,
    };

    api.get(getBooks(), { params })
      .then((res) => {
        setOptions(res.data.data);
      })
      .catch((error) => {
        console.error("Error searching books:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to search books. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setLoading(false);
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

  const fetchUsers = (search) => {
    if (!search) {
      setOptionsUser([]);
      return;
    }
    setUserLoading(true);

    const params = {
      page: 1,
      row: 15,
      search: search,
    };

    api.get(getUsers(), { params })
      .then((res) => {
        setOptionsUser(res.data.data);
      })
      .catch((error) => {
        console.error("Error searching users:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to search users. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setUserLoading(false);
      });
  };

  const handleDateChange = (newDate) => {
    setDueDate(newDate);
    if (newDate) {
      const formattedDate = dayjs(newDate).format('YYYY-MM-DD');
      setEditedData((prevData) => ({
        ...prevData,
        due_date: formattedDate,
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        due_date: null,
      }));
    }
  };

  const debouncedFetchBooks = useCallback(debounce(fetchBooks, 700), []);
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 700), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'department' && value === 'SENIORHIGH') {
      setEditedData(prev => ({
        ...prev,
        [name]: value,
        year_level: ''
      }));
    } else {
      setEditedData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: checked ? "Active" : "Inactive",
    }));
  };
  const handleSubjectChange = (event, newValue) => {
    setSelectedSubjects(newValue);
    setEditedData(prev => ({
      ...prev,
      subject_ids: newValue.map(subject => subject.id)
    }));
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setEditedData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleBookSelect = (event, newValue) => {
    setSelectedBook(newValue);
    setEditedData((prevData) => ({
      ...prevData,
      book_id: newValue ? newValue.id : null,
    }));
  };

  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);
    setEditedData((prevData) => ({
      ...prevData,
      user_id: newValue ? newValue.id : null,
    }));
  };

  const renderField = (key) => {
    switch (key) {
      case "description":
        return (
          <TextField
            key={key}
            fullWidth
            margin="normal"
            label={capitalizeFirstLetter(key)}
            name={key}
            multiline
            rows={4}
            value={editedData[key] || ""}
            onChange={handleInputChange}
          />
        );

      case "year_level":
        return (
          <TextField
            key={key}
            select
            fullWidth
            margin="normal"
            label="Year Level"
            name="year_level"
            value={editedData[key] || ""}
            onChange={handleInputChange}
            required
          >
            {editedData.department === "SENIORHIGH" ? [
              <MenuItem key="11" value="11">Grade 11</MenuItem>,
              <MenuItem key="12" value="12">Grade 12</MenuItem>
            ] : [
              <MenuItem key="1" value="1">1st Year</MenuItem>,
              <MenuItem key="2" value="2">2nd Year</MenuItem>,
              <MenuItem key="3" value="3">3rd Year</MenuItem>,
              <MenuItem key="4" value="4">4th Year</MenuItem>
            ]}
          </TextField>
        );

      case "department":
        return (
          <TextField
            key={key}
            select
            fullWidth
            margin="normal"
            label="Department"
            name="department"
            value={editedData[key] || ""}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
            <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
            <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
            <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
            <MenuItem value="THEO">Theology</MenuItem>
            <MenuItem value="SENIORHIGH">SENIOR HIGH</MenuItem>
          </TextField>
        );

      case "semester":
        return (
          <TextField
            key={key}
            select
            fullWidth
            margin="normal"
            label="Semester"
            name="semester"
            value={editedData[key] || ""}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="first">First</MenuItem>
            <MenuItem value="second">Second</MenuItem>
          </TextField>
        );

      case "status":
        return (
          <FormControlLabel
            key={key}
            control={
              <Switch
                color="success"
                checked={editedData[key] === "active"}
                onChange={handleSwitchChange}
                name={key}
              />
            }
            label={editedData[key] === "active" ? "Active" : "Inactive"}
          />
        );

      case "author_id":
      case "category_id":
        const options = key === "author_id" ? authors : categories;
        return (
          <FormControl fullWidth margin="normal" key={key}>
            <Autocomplete
              id={key}
              options={options}
              getOptionLabel={(option) => option.name}
              value={options.find(option => option.id === editedData[key]) || null}
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: key,
                    value: newValue ? newValue.id : ''
                  }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={key === "author_id" ? "Author" : "Category"}
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        );

      case "image":
        return (
          <Box key={key} margin="normal">
            <FileInput onChange={handleFileChange} fileName={fileName} />
          </Box>
        );

      case "user_id":
        return (
          <Autocomplete
            sx={{ marginTop: "10px" }}
            key={key}
            options={optionsUser}
            getOptionLabel={(optionsUser) => 
              `${optionsUser.first_name} ${optionsUser.last_name} - ${optionsUser.id_number}`}
            isOptionEqualToValue={(optionsUser, value) => optionsUser.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search student"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {userLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            value={selectedUser}
            onChange={handleUserSelect}
            onInputChange={(event, newInputValue) => {
              debouncedFetchUsers(newInputValue);
            }}
            loading={userLoading}
            filterOptions={(x) => x}
          />
        );

      case "book_id":
        return (
          <Autocomplete
            sx={{ marginTop: "10px" }}
            key={key}
            options={options}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search books"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            value={selectedBook}
            onChange={handleBookSelect}
            onInputChange={(event, newInputValue) => {
              debouncedFetchBooks(newInputValue);
            }}
            loading={loading}
            filterOptions={(x) => x}
          />
        );

      case "due_date":
        return (
          <DatePicker
            sx={{ marginTop: "10px", width: "100%" }}
            value={editedData[key] ? dayjs(editedData[key]) : null}
            onChange={handleDateChange}
            label="Select a due date"
            format="MM/DD/YYYY"
            disablePast
            views={['year', 'month', 'day']}
          />
        );
        case "subject_ids":
        return (
          <Paper elevation={2} sx={{ p: 2, mt: 2 }} key={key}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
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
            />
          </Paper>
        );

      default:
        return (
          <TextField
            key={key}
            fullWidth
            margin="normal"
            type={getInputType(key)}
            label={capitalizeFirstLetter(key)}
            name={key}
            value={editedData[key] || ""}
            onChange={handleInputChange}
          />
        );
    }
  };

  const onSave = () => {
    handleSave({ ...rowData, ...editedData });
    setFileName('');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: title === "Edit Book" ? 1000 : 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <Typography id="edit-modal-title" variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={title === "Edit Book" ? 6 : 12}>
            {editableColumns.map(key => renderField(key))}
          </Grid>
          
          {title === "Edit Book" && (
            <Grid item xs={6} sx={{ overflow: "hidden" }}>
              <Box>
                <img 
                  src={editedData.image ? 
                    `http://127.0.0.1:8000/storage/${editedData.image}` : 
                    noImage
                  } 
                  alt="Book cover" 
                  width="100%" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = noImage;
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Grid container justifyContent="right" sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: "10px" }}
            onClick={onSave}
          >
            Save
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditModal;
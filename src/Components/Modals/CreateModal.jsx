import React, { useState, useEffect, useCallback } from "react";
import {
  allAuthors,
  allCategories,
  getBooks,
  getUsers,
} from "../../Utils/endpoint";
import debounce from "lodash/debounce";
import api from "../../Utils/interceptor";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  FormLabel,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { capitalizeFirstLetter, getInputType } from "../../Utils/helper";
import FileInput from "../Layout/FileInput";
import Swal from "sweetalert2";
import dayjs from 'dayjs';

const CreateCategoryModal = ({
  open,
  handleClose,
  handleCreate,
  createableColumns,
  title,
}) => {
  const initialData = createableColumns.reduce(
    (acc, col) => ({
      ...acc,
      [col]: col === "status" ? "inactive" : "",
    }),
    {}
  );
  
  const [newCategoryData, setNewCategoryData] = useState(initialData);
  const [fileName, setFileName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
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

    if (title == "Add a new Book") {
      fetchAuthors();
      fetchCategory();
    }

    if(title == "Issue Book"){
      fetchUsers('all');
      fetchBooks('all');
    }
  }, []);

  const fetchCategory = () => {
    api
      .get(allCategories())
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchAuthors = () => {
    api
      .get(allAuthors())
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

    api
      .get(getBooks(), { params })
      .then((res) => {
        setOptions(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error searching books :", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to search books . Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setLoading(false);
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

    api
      .get(getUsers(), { params })
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
      setNewCategoryData((prevData) => ({
        ...prevData,
        due_date: formattedDate,
      }));
    } else {
      setNewCategoryData((prevData) => ({
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
      setNewCategoryData(prev => ({
        ...prev,
        [name]: value,
        year_level: '' // Reset year_level when switching to SENIORHIGH
      }));
    } else {
      setNewCategoryData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setNewCategoryData((prev) => ({
      ...prev,
      [name]: checked ? "active" : "inactive",
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
            value={newCategoryData[key] || ""}
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
            value={newCategoryData[key] || ""}
            onChange={handleInputChange}
            required
          >
            {newCategoryData.department === "SENIORHIGH" ? [
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
            value={newCategoryData[key] || ""}
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
            value={newCategoryData[key] || ""}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="first">First</MenuItem>
            <MenuItem value="second">Second</MenuItem>
          </TextField>
        );

      case "status":
        return (
          <div key={key}>
            <FormLabel component="legend">Status</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={newCategoryData[key] === "active"}
                  onChange={handleSwitchChange}
                  name={key}
                />
              }
              label={newCategoryData[key] === "active" ? "Active" : "Inactive"}
            />
          </div>
        );

      case "author_id":
      case "category_id":
       const optionz = key === "author_id" ? authors : categories;
        return (
          <FormControl fullWidth margin="normal" key={key}>
            <InputLabel id={`${key}-label`}>
              {key === "author_id" ? "Author" : "Category"}
            </InputLabel>
            <Select
              labelId={`${key}-label`}
              id={key}
              value={newCategoryData[key] || ""}
              label={capitalizeFirstLetter(key)}
              onChange={handleInputChange}
              name={key}
            >
              {optionz.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
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
            value={dueDate}
            onChange={handleDateChange}
            label="Select a due date"
            format="MM/DD/YYYY"
            disablePast
            views={['year', 'month', 'day']}
          />
        );

      default:
        return (
          <TextField
            key={key}
            fullWidth
            margin="normal"
            label={capitalizeFirstLetter(key)}
            name={key}
            type={getInputType(key)}
            value={newCategoryData[key] || ""}
            onChange={handleInputChange}
          />
        );
    }
  };

  const handleBookSelect = (event, newValue) => {
    setSelectedBook(newValue);
    setNewCategoryData((prevData) => ({
      ...prevData,
      book_id: newValue ? newValue.id : null,
    }));
  };

  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);
    setNewCategoryData((prevData) => ({
      ...prevData,
      user_id: newValue ? newValue.id : null,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setNewCategoryData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const onCreate = () => {
    setFileName("");
    setSelectedUser(null);
    setSelectedBook(null);
    setDueDate(null);
    handleCreate(newCategoryData);
    handleClose();
    setNewCategoryData(initialData);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-category-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <Typography
          id="create-category-modal-title"
          variant="h6"
          component="h2"
          mb={2}
        >
          {title}
        </Typography>

        {createableColumns.map(key => renderField(key))}

        <Grid container justifyContent="right" sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: "10px" }}
            onClick={onCreate}
          >
            Create
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CreateCategoryModal;
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
  const [fileName, setFileName] = useState("");
  const [newCategoryData, setNewCategoryData] = useState(initialData);
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
        console.error("Error searching books :", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to search books . Please try again.",
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
      // Format the date as YYYY-MM-DD for Laravel
      const formattedDate = dayjs(newDate).format('YYYY-MM-DD');

      
      // Update the parent component's state
      setNewCategoryData((prevData) => ({
        ...prevData,
        due_date: formattedDate,
      }));
    } else {
      // If the date is cleared, update with null
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
    setNewCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setNewCategoryData((prev) => ({
      ...prev,
      [name]: checked ? "active" : "inactive",
    }));
  };

  const handleBookSelect = (event, newValue) => {
    setSelectedBook(newValue);
   
    // Update the parent state with the selected book's ID
    setNewCategoryData((prevData) => ({
      ...prevData,
      book_id: newValue ? newValue.id : null,
    }));
  };

  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);

    // Update the parent state with the selected book's ID
    setNewCategoryData((prevData) => ({
      ...prevData,
      user_id: newValue ? newValue.id : null,
    }));
  };

  const onCreate = () => {
    setFileName("");
    setSelectedUser(null);
    setSelectedBook(null);
    setDueDate(null);
    handleCreate(newCategoryData);
    handleClose();
    setNewCategoryData(initialData); // Reset form after creation
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    // You might want to update newCategoryData here as well
    setNewCategoryData((prevData) => ({
      ...prevData,
      image: file,
    }));
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
        }}
      >
        <Typography
          id="create-category-modal-title"
          variant="h6"
          component="h2"
        >
          {title}
        </Typography>

        {createableColumns.map((key) => {
          if (key === "status") {
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
                  label={
                    newCategoryData[key] === "active" ? "Active" : "Inactive"
                  }
                />
              </div>
            );
          } else if (key === "author_id" || key === "category_id") {
            const options = key === "author_id" ? authors : categories;
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
                  {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          } else if (key === "image") {
            return (
              <Box key={key} margin="normal">
                <FileInput onChange={handleFileChange} fileName={fileName} />
              </Box>
            );
          } else if (key === "user_id") {
            return (
              <Autocomplete
                sx={{ marginTop: "10px" }}
                key={key}
                options={optionsUser}
                getOptionLabel={(optionsUser) => `${optionsUser.first_name} ${optionsUser.last_name} - ${optionsUser.id_number}`}
                isOptionEqualToValue={(optionsUser, value) => optionsUser.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search student"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {userLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
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
          } else if (key === "book_id") {
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
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
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
          } else if(key === 'due_date'){
            return (
              <DatePicker sx={{ marginTop: "10px" ,width: "100%"}}
              value={dueDate}
          onChange={handleDateChange}
               label="Select a dute date"
              format="MM/DD/YYYY"
              disablePast
              views={['year', 'month', 'day']}
              
              />
            )
          }
          
          else {
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
        })}
        <Grid container justifyContent={"right"} sx={{ marginTop: "20px" }}>
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

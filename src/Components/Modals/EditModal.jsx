import React, { useState, useEffect, useCallback } from "react";
import {  
  allAuthors,
  allCategories,
  getBooks,
  getUsers,
  showUser,
  showBook } from "../../Utils/endpoint";
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



;
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

    if (title == "Edit Book") {
      fetchAuthors();
      fetchCategory();
    }

    if(title == "Issue Book"){
      fetchUsers('all');
      fetchBooks('all');
      fetchCurrentBook(editedData.book_id)
      fetchCurrentUser(editedData.user_id)
    }

  }, []);

  const fetchCurrentBook = (id) => {
    api
      .get(showBook(id))
      .then((res) => {
;
        setSelectedBook(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchCurrentUser = (id) => {
    api
      .get(showUser(id))
      .then((res) => {
   
        setSelectedUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
      setEditedData((prevData) => ({
        ...prevData,
        due_date: formattedDate,
      }));
    } else {
      // If the date is cleared, update with null
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
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    handleSave({ ...rowData, ...editedData });
    setFileName('');
    handleClose();
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: checked ? "Active" : "Inactive",
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    // You might want to update newCategoryData here as well
    setEditedData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleBookSelect = (event, newValue) => {
    setSelectedBook(newValue);

    // Update the parent state with the selected book's ID
    setEditedData((prevData) => ({
      ...prevData,
      book_id: newValue ? newValue.id : null,
    }));
  };

  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);

    // Update the parent state with the selected book's ID
    setEditedData((prevData) => ({
      ...prevData,
      user_id: newValue ? newValue.id : null,
    }));
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
        }}
      >
        <Typography id="edit-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={title === "Edit Book" ? 6 : 12}>
            {editableColumns.map((key) => {
              if (key === "status") {
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
              } else if (key === "author_id" || key === "category_id") {
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
              } else if (key === "image") {
                return (
                  <Box key={key} margin="normal">
                    {/* <img src={`http://127.0.0.1:8000/storage/${editedData[key]}`} /> */}
                    <FileInput
                      onChange={handleFileChange}
                      fileName={fileName}
                    />
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
                  value={editedData[key] ? dayjs(editedData[key]) : null}
                 onChange={handleDateChange}
                   label="Select a dute date"
                  format="MM/DD/YYYY"
                  disablePast
                  views={['year', 'month', 'day']}
                  
                  />
                )
              }  else {
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
            })}
          </Grid>
          {title === "Edit Book" && (
  (editedData.image === "" || editedData.image == null) ? (
    <Grid item xs={6}>
      <Box>
        <img 
          src={noImage}
          alt="No book cover" 
          width={'100%'} 
        />
      </Box>
    </Grid>
  ) : (
    <Grid item xs={6} sx={{ overflow:"hidden"}}>
      <Box>
        <img 
          src={`http://127.0.0.1:8000/storage/${editedData.image}`} 
          alt="Book cover" 
          width={'100%'} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = noImage;
          }}
        />
      </Box>
    </Grid>
  )
)}
          
        </Grid>
        <Grid container justifyContent={"right"} sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: "10px" }}
            onClick={onSave}
          >
            Save
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditModal;

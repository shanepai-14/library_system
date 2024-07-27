import React, { useState, useEffect } from "react";
import { allAuthors, allCategories } from "../../Utils/endpoint";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Switch,
  MenuItem,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { capitalizeFirstLetter, getInputType } from "../../Utils/helper";
import FileInput from "../Layout/FileInput";
import api from "../../Utils/interceptor";
import noImage from "../../../public/No-Image-Placeholder.svg"
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

  console.log(editedData);
  const [fileName, setFileName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setFileName("");

    if (title == "Edit Book") {
      fetchAuthors();
      fetchCategory();
    }
  }, []);
  const fetchCategory = () => {
    api
      .get(allCategories())
      .then((res) => {
        console.log(res.data);
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
        console.log(res.data);
        setAuthors(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    handleSave({ ...rowData, ...editedData });
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
                    <InputLabel id={`${key}-label`}>
                      {key === "author_id" ? "Author" : "Category"}
                    </InputLabel>
                    <Select
                      labelId={`${key}-label`}
                      id={key}
                      value={editedData[key] || ""}
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
                    {/* <img src={`http://127.0.0.1:8000/storage/${editedData[key]}`} /> */}
                    <FileInput
                      onChange={handleFileChange}
                      fileName={fileName}
                    />
                  </Box>
                );
              } else {
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
    <Grid item xs={6}>
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

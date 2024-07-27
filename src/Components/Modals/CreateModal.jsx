import React, { useState ,useEffect } from 'react';
import {  allAuthors , allCategories} from '../../Utils/endpoint';
import api from '../../Utils/interceptor';
import { Modal, Box, Typography, Button, TextField, Switch, FormControlLabel ,Grid ,FormLabel, FormControl ,Select ,InputLabel, MenuItem } from '@mui/material';
import { capitalizeFirstLetter , getInputType } from '../../Utils/helper';
import FileInput from '../Layout/FileInput';


const CreateCategoryModal = ({ open, handleClose, handleCreate, createableColumns,title }) => {
  const initialData = createableColumns.reduce((acc, col) => ({ 
    ...acc, 
    [col]: col === 'status' ? 'inactive' : '' 
  }), {});

  const [newCategoryData, setNewCategoryData] = useState(initialData);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setFileName('');
     
  if(title == 'Add a new Book'){

    fetchAuthors();
    fetchCategory();

  }
   

 }, []);
 const fetchCategory = () => {

  api.get(allCategories())
   .then(res => {
     console.log(res.data);
     setCategories(res.data);
   })
   .catch(err => {
     console.error(err);
   });
}



 const fetchAuthors = () => {
   api.get(allAuthors())
    .then(res => {
      console.log(res.data);
      setAuthors(res.data);
    })
    .catch(err => {
      console.error(err);
    });
 }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setNewCategoryData(prev => ({ ...prev, [name]: checked ? 'active' : 'inactive' }));
  };

  const onCreate = () => {
    setFileName('');
    handleCreate(newCategoryData);
    handleClose();
    setNewCategoryData(initialData); // Reset form after creation
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    // You might want to update newCategoryData here as well
    setNewCategoryData(prevData => ({
      ...prevData,
      image: file
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
                <InputLabel id={`${key}-label`}>{key === "author_id" ? 'Author' : 'Category'}</InputLabel>
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
           } else if (key === 'image') {
              return (
                <Box key={key} margin="normal">
                  <FileInput onChange={handleFileChange} fileName={fileName} />
                </Box>
              );

          } else {
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
import React from 'react';
import { Typography, Button, Grid  } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const FileInput = ({ onChange, fileName }) => {
    return (
      <Grid container justifyContent={"left"} sx={{ marginTop: "20px" }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={onChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" startIcon={<AddPhotoAlternateIcon/>}>
            Upload Image
          </Button>
        </label>
        {fileName && (
          <Typography variant="body2" style={{ marginTop: 10,marginLeft:5 }}>
            Selected file: {fileName}
          </Typography>
        )}
      </Grid>
    );
  };

  export default FileInput;

// In your component where you want to use the FileInput:
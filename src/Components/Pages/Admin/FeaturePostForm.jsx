import React, { useState , useEffect} from 'react';
import { Box, TextField, Button, Typography, Paper, Snackbar, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../../Utils/interceptor';
import PostList from './PostList';
import PostSkeleton from './PostSkelenton';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { PostRoute } from '../../../Utils/endpoint';

const FeaturePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    api.post(PostRoute(), { title, content })
      .then((res) => {
        setSnackbar({ open: true, message: 'Feature post created successfully!' });
        setTitle('');
        setContent('');
      })
      .catch((error) => {
        setSnackbar({ open: true, message: 'Error creating feature post. Please try again.' });
        console.error('Error creating feature post:', error);
      })
      .finally(() => {
        setLoading(false);
        fetchPosts();
      });
  };

  useEffect(() => {

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setPostLoading(true)
    api.get(PostRoute())
    .then((res) => {
      setPosts(res.data); // Assuming the response contains the list of posts in 'data'
      setSnackbar({ open: true, message: 'Posts fetched successfully!' });
      console.log(res.data)
    })
    .catch((error) => {
      setSnackbar({ open: true, message: 'Error fetching posts. Please try again.' });
      console.error('Error fetching posts:', error);
    })
    .finally(() => {
    setPostLoading(false);
    });
};
const handleDeletePost = async (id) => {
    try {
      await api.delete(`/feature-posts/${id}`); // Adjust the endpoint based on your API
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setSnackbar({ open: true, message: 'Post deleted successfully!' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      setSnackbar({ open: true, message: 'Error deleting post. Please try again.' });
    }
  };

  return (
    <Grid container spacing={2}>
    <Grid item xs={6} md={4} sx={{paddingLeft:'0!important'}}>
     <Box 
     sx={{
        maxHeight: '90vh', // 80% of the viewport height
        overflowY: 'auto', // Enable vertical scrolling on overflow // Add some padding for better spacing
        backgroundColor: '#f5f5f5', // Optional background color for better visibility
        borderRadius: 2, // Rounded corners for styling
      }}
      >
     {postLoading ? (
          <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        posts.map((post) => (
          <PostList key={post.id} post={post} handleDeletePost={handleDeletePost} /> // Render each post using the Post component
        ))
      )}
     </Box>
     </Grid>
     <Grid item xs={6} md={8}>
    <Box  sx={{width:'100%'}}>
    <Paper elevation={3} sx={{ p: 3, width:'100%'  }}>
        <Typography variant="h4" gutterBottom>
          Create Announcement
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <ReactQuill
            value={content}
            onChange={setContent}
            style={{ height: '200px', marginBottom: '50px' }}
          />
     <LoadingButton
        sx={{ mt: 3, mb: 2 }}
                fullWidth
               type="submit"
                endIcon={< AnnouncementIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
        >
          Submit Post
        </LoadingButton>
      
        </form>
       
      </Paper>
    </Box>
    </Grid>
  
    <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    message={snackbar.message}
  />
   </Grid>
  );
};

export default FeaturePostForm;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, 
  TextField, 
  Typography, 
  Paper, 
  Snackbar, 
  Grid,
  Alert 
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../../Utils/interceptor';
import PostList from './PostList';
import PostSkeleton from './PostSkelenton';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { PostRoute } from '../../../Utils/endpoint';

const FeaturePostForm = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Query for fetching posts
  const { 
    data: posts = [], 
    isLoading: isLoadingPosts,
    isError: isPostsError,
    error: postsError
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get(PostRoute());
      return response.data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Mutation for creating posts
  const createPostMutation = useMutation({
    mutationFn: async (newPost) => {
      return api.post(PostRoute(), newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setSnackbar({ 
        open: true, 
        message: 'Feature post created successfully!',
        severity: 'success'
      });
      resetForm();
    },
    onError: (error) => {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Error creating feature post. Please try again.',
        severity: 'error'
      });
    },
  });

  // Mutation for deleting posts
  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      return api.delete(`/feature-posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setSnackbar({ 
        open: true, 
        message: 'Post deleted successfully!',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Error deleting post. Please try again.',
        severity: 'error'
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    createPostMutation.mutate({ title, content });
  };

  const handleDeletePost = (id) => {
    deletePostMutation.mutate(id);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
  };

  const renderPostsList = () => {
    if (isLoadingPosts) {
      return Array(4).fill(null).map((_, index) => (
        <PostSkeleton key={index} />
      ));
    }

    if (isPostsError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            {postsError.message || 'Error loading posts'}
          </Alert>
        </Box>
      );
    }

    if (posts.length === 0) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="info">
            No announcements available
          </Alert>
        </Box>
      );
    }

    return posts.map((post) => (
      <Box sx={{ px: 2 }} key={post.id}>
        <PostList 
          post={post} 
          handleDeletePost={handleDeletePost}
          isDeleting={deletePostMutation.isPending}
        />
      </Box>
    ));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} sx={{ paddingLeft: '0!important' }}>
        <Box sx={{
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          width: '100%',
        }}>
          {renderPostsList()}
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <Box sx={{ width: '100%' }}>
          <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
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
                disabled={createPostMutation.isPending}
              />
              <ReactQuill
                value={content}
                onChange={setContent}
                style={{ height: '200px', marginBottom: '50px' }}
                readOnly={createPostMutation.isPending}
              />
              <LoadingButton
                sx={{ mt: 3, mb: 2 }}
                fullWidth
                type="submit"
                endIcon={<AnnouncementIcon />}
                loading={createPostMutation.isPending}
                loadingPosition="end"
                variant="contained"
                disabled={!title || !content}
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
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default FeaturePostForm;
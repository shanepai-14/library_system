import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';

const PostList = ({ post,handleDeletePost,deleteView=true }) => {
  const { author , created_at, title, content,id } = post;
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const maxContentLength = 200; // Content length to show before truncating

  const isContentTruncated = content.length > maxContentLength;

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };



  const toggleReadMore = () => {
    setShowMore(!showMore);
  };

  return (
    <Card sx={{ borderRadius: 3, margin: 2, boxShadow: 2,width:'500px' }}>
      <CardHeader
        avatar={
          <Avatar aria-label="author">{author.first_name.charAt(0)}</Avatar>
        }
        action={

            deleteView ? ( // Conditional rendering based on deleteView
                <IconButton onClick={handleMoreClick}>
                  <MoreVertIcon />
                </IconButton>
              ) : null
        }
        title={author.first_name + ' ' + author.last_name}
        subheader={format(new Date(created_at), 'MMMM dd, yyyy, h:mm a')}
      />
      {deleteView && 
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleDeletePost(id)}>Delete</MenuItem>
      </Menu>
      }
      
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isContentTruncated && !showMore ? (
            <>
             <div
              dangerouslySetInnerHTML={{
                __html: content.slice(0, maxContentLength),
              }}
            />
              <span
                onClick={toggleReadMore}
                style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
              >
                Read more
              </span>
            </>
          ) : (
            <>
               <div
            dangerouslySetInnerHTML={{ __html: content }}
          />
              {isContentTruncated && (
                <span
                  onClick={toggleReadMore}
                  style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                >
                  Show less
                </span>
              )}
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};


export default PostList;

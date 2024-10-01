import React from 'react';
import { Card, CardContent, IconButton, Skeleton } from '@mui/material';

const PostSkeleton = () => {
  return (
    <Card sx={{ borderRadius: 4, margin: 2,width:'500px' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Skeleton for Avatar, Name, and Date */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={40} height={40} />
            <div style={{ marginLeft: 8 }}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={60} />
            </div>
          </div>
          
          {/* Skeleton for More icon */}
          <IconButton>
            <Skeleton variant="circular" width={24} height={24} />
          </IconButton>
        </div>

        {/* Skeleton for Title */}
        <Skeleton variant="text" width="80%" height={32} style={{ marginTop: 16 }} />

        {/* Skeleton for Content */}
        <Skeleton variant="rectangular" width="100%" height={100} style={{ marginTop: 16 }} />
      </CardContent>
    </Card>
  );
};

export default PostSkeleton;

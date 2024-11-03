import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const DashboardCardSkeleton = () => {
  return (
    <Card style={{ borderRadius: "12px", width: 220, height: 120 }}>
      <CardContent style={{ display: "flex", alignItems: "center", justifyContent: 'center', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Skeleton variant="circular" width={40} height={40} style={{ marginRight: "20px" }} />
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={30} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCardSkeleton;
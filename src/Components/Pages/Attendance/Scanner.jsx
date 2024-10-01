import React, { useState, useEffect } from 'react';
import { useZxing } from "react-zxing";
import { Box ,Typography } from "@mui/material";

const Scanner = ({ onScan, isScanning }) => {
  const [error, setError] = useState(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedUserID = result.getText();
      onScan(scannedUserID);
    },
    paused: !isScanning,
    onError(error) {
        console.error("Scanner error:", error);
        setError("Camera access error. Please check permissions.");
      },

  });



  return (
    <Box sx={{ width: "100%", maxWidth: 600, position: "relative",margin:"auto",borderRadius:1,overflow:"hidden" }}>
      {isScanning && (
        <video
          ref={ref}
          style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius:1}}
        />
      )}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Scanner;
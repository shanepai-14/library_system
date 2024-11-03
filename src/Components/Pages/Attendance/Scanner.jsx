import React, { useState, useEffect } from 'react';
import { useZxing } from "react-zxing";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// Styled Components
const ScannerContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  margin: "auto",
  position: "relative",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  backgroundColor: 'rgba(0, 0, 0, 0.03)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const VideoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.03)',
  zIndex: 1,
}));

const ScannerFrame = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '250px',
  height: '250px',
  border: '2px solid ' + theme.palette.primary.main,
  borderRadius: theme.spacing(1),
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 'inherit',
  }
}));

const Scanner = ({ onScan, isScanning }) => {
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedUserID = result.getText();
      onScan(scannedUserID);
    },
    paused: !isScanning,
    onError(error) {
      console.error("Scanner error:", error);
      if (error.name === "NotAllowedError") {
        setError("Camera access denied. Please check permissions.");
      } else if (error.name === "NotFoundError") {
        setError("No camera found on this device.");
        setHasCamera(false);
      } else {
        setError("Camera error. Please try again.");
      }
    },
  });

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (ref.current && ref.current.srcObject) {
        const tracks = ref.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <ScannerContainer elevation={3}>
      {isScanning ? (
        <Box sx={{ position: 'relative', paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
          <video
            ref={ref}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <ScannerFrame />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              zIndex: 2,
            }}
          >
            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'white' }}
            >
              Position QR code within the frame
            </Typography>
          </Box>
        </Box>
      ) : (
        <VideoOverlay>
          {error ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <VideocamOffIcon 
                color="error" 
                sx={{ fontSize: 48, mb: 2 }} 
              />
              <Typography 
                color="error" 
                variant="body1" 
                sx={{ maxWidth: 300 }}
              >
                {error}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <QrCodeScannerIcon 
                color="primary" 
                sx={{ fontSize: 48, mb: 2 }} 
              />
              <Typography 
                color="textSecondary"
                variant="body1"
              >
                Scanner paused
              </Typography>
            </Box>
          )}
        </VideoOverlay>
      )}
    </ScannerContainer>
  );
};

export default Scanner;
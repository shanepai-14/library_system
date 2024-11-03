
import api from '../../Utils/interceptor';
import { viewPassword , updatePassword } from '../../Utils/endpoint';
import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box,
  IconButton,
  InputAdornment,
  Modal,
  CircularProgress,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const UserPasswordRecovery = ({ userId, open, handleClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (open && userId) {
      handleFetchUser();
    }
  }, [open, userId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
  }, [open]);

  const handleFetchUser = async () => {
    if (!userId) {
      Swal.fire({
        title: "Error!",
        text: "No user ID provided",
        icon: "error",
        confirmButtonText: "OK",
      });
      handleClose();
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(viewPassword(userId));
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to fetch user data",
        icon: "error",
        confirmButtonText: "OK",
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        title: "Error!",
        text: "Password must be at least 8 characters long",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setUpdating(true);
    try {
      await api.post(updatePassword(userId), {
        new_password: newPassword
      });

      Swal.fire({
        title: "Success!",
        html: `
          <p>Password updated successfully.</p>
          <p><strong>New Password:</strong> ${newPassword}</p>
          <button id="copyButton" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Copy Password</button>
        `,
        icon: "success",
        showConfirmButton: false,
        didOpen: () => {
          // Add event listener to copy button
          const copyButton = document.getElementById('copyButton');
          copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(newPassword).then(() => {
              Swal.fire({
                title: "Copied!",
                text: "The new password has been copied to your clipboard.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
              });
            });
          });
        }
      });

      // Reset form and close modal
      setNewPassword('');
      setConfirmPassword('');
      handleClose();

    } catch (error) {
      handleClose();
      console.error('Error updating password:', error);
      
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update password",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleModalClose = () => {
    setUserData(null);
    setShowPassword(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="password-recovery-modal"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Update User Password
          </Typography>
          <IconButton onClick={handleModalClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : userData ? (
          <Box>
            {/* User Info */}
            <TextField
              fullWidth
              label="Name"
              value={`${userData.first_name} ${userData.last_name}`}
              disabled
              sx={{ mb: 2 }}
              size="small"
            />
            
            <TextField
              fullWidth
              label="Email"
              value={userData.email}
              disabled
              sx={{ mb: 3 }}
              size="small"
            />

            <Divider sx={{ my: 2 }} />

            {/* Password Update Form */}
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Set New Password
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />
          </Box>
        ) : (
          <Typography color="text.secondary">
            No user data available
          </Typography>
        )}

        {/* Footer */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            onClick={handleModalClose} 
            variant="outlined"
            disabled={updating}
          >
            Cancel
          </Button>
          {userData && (
            <Button 
              onClick={handleUpdatePassword}
              variant="contained"
              disabled={!newPassword || !confirmPassword || updating}
            >
              {updating ? 'Updating...' : 'Update Password'}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default UserPasswordRecovery;
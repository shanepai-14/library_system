import api from '../../Utils/interceptor';
import { viewPassword, updatePassword } from '../../Utils/endpoint';
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
  Divider,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto'
};

const UserPasswordRecovery = ({ userId, open, handleClose , editPassword = false }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="password-recovery-modal"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" component="h2">
            Update User Password
          </Typography>
          <IconButton onClick={handleModalClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : userData ? (
          <Box>
            {/* Profile Picture */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Avatar
                src={
                  userData.profile_picture
                    ? `http://127.0.0.1:8000/storage/${userData.profile_picture}`
                    : undefined
                }
                sx={{
                  width: 150,
                  height: 150,
                  border: 3,
                  borderColor: "primary.main",
                  fontSize: "3rem",
                }}
              >
                {userData.first_name[0]}
                {userData.last_name[0]}
              </Avatar>
            </Box>

            {/* User Info Sections */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ID Number"
                    value={userData.id_number}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={userData.role.toUpperCase()}
                      color="primary"
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                    <Chip
                      label={userData.course}
                      color="secondary"
                      size="small"
                    />
                    <Chip
                      label={userData.deleted_at ? "Deactivated" : "Active"}
                      color={userData.deleted_at ? "error" : "success"}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={userData.first_name}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Middle Name"
                    value={userData.middle_name || "N/A"}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={userData.last_name}
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Academic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Course"
                    value={userData.course || "N/A"}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year Level"
                    value={userData.year_level || "N/A"}
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={userData.email}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={userData.contact_number}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={userData.address}
                    disabled
                    size="small"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    value={userData.gender}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Birthday"
                    value={formatDate(userData.birthday)}
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Password Update Form */}
            {editPassword && (
              <>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Set New Password
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">No user data available</Typography>
        )}

        {/* Footer */}
        {editPassword && (
          <>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
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
                  {updating ? "Updating..." : "Update Password"}
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UserPasswordRecovery;
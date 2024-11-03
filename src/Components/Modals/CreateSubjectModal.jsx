import React, { useState , useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box
} from '@mui/material';
import axios from 'axios';

const SubjectModal = ({ open, handleClose, setRefresh }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        year_level: '',
        department: '',
        semester: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (formData.department === "SENIORHIGH") {
            // If current year level is not 11 or 12, reset it
            if (!["11", "12"].includes(formData.year_level)) {
                setFormData(prev => ({
                    ...prev,
                    year_level: "11" // Default to Grade 11
                }));
            }
        } else {
            // If current year level is 11 or 12, reset it
            if (["11", "12"].includes(formData.year_level)) {
                setFormData(prev => ({
                    ...prev,
                    year_level: "1" // Default to 1st Year
                }));
            }
        }
    }, [formData.department]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(route('subjects.store'), formData);
            setRefresh(prev => prev + 1);
            handleClose();
            setFormData({
                code: '',
                name: '',
                description: '',
                year_level: '',
                department: '',
                semester: ''
            });
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Subject</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Subject Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        error={!!errors.code}
                        helperText={errors.code?.[0]}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Subject Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name?.[0]}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description?.[0]}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        error={!!errors.department}
                        helperText={errors.department?.[0]}
                        margin="normal"
                        required
                    >
                        <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                        <MenuItem value="BEED">Bachelor in Elementary Education</MenuItem>
                        <MenuItem value="BSED-ENGLISH">Bachelor of Secondary Education Major In English</MenuItem>
                        <MenuItem value="BSED-MATH">Bachelor of Secondary Education Major In Math</MenuItem>
                        <MenuItem value="THEO">Theology</MenuItem>
                        <MenuItem value="SENIORHIGH">SENIOR HIGH</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Year Level"
                        name="year_level"
                        value={formData.year_level}
                        onChange={handleChange}
                        error={!!errors.year_level}
                        helperText={errors.year_level?.[0]}
                        margin="normal"
                        required
                    >
                        {formData.department === "SENIORHIGH" ? (
                            // Show only Grade 11 and 12 for Senior High
                            <>
                                <MenuItem value="11">Grade 11</MenuItem>
                                <MenuItem value="12">Grade 12</MenuItem>
                            </>
                        ) : (
                            // Show college year levels for other departments
                            <>
                                <MenuItem value="1">1st Year</MenuItem>
                                <MenuItem value="2">2nd Year</MenuItem>
                                <MenuItem value="3">3rd Year</MenuItem>
                                <MenuItem value="4">4th Year</MenuItem>
                            </>
                        )}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        error={!!errors.semester}
                        helperText={errors.semester?.[0]}
                        margin="normal"
                        required
                    >
                        <MenuItem value="first">First</MenuItem>
                        <MenuItem value="second">Second</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained" 
                    disabled={loading}
                >
                    Create Subject
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubjectModal;
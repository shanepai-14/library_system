import React, { useRef, useState } from "react";
import {
  Typography,
  Grid,
  Avatar,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@mui/material";
import QRCode from "react-qr-code";
import { formatDate } from "../../../Utils/helper.jsx";
import { useAuth } from "../../Auth/AuthContext.jsx";
import html2canvas from "html2canvas";
import EditModal from "../../Modals/EditModal.jsx";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../Utils/endpoint.jsx";
import Swal from "sweetalert2";
const StudentAccount = () => {
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const tableRowPadding = "none";
  const [edit, setEdit] = useState(false);

  const qrBoxRef = useRef(null);
  const editableColumns = [
    "first_name",
    "last_name",
    "middle_name",
    "address",
    "contact_number",
  ];
  const handleEdit = () => {
    setEdit(true);
  };
  const handleClose = () => {
    setEdit(false);
  };

  const handleSave = (dataToUpdate) => {
    setEdit(false);

    const userID = userData.id; // Assuming you have access to the user's role

    updateUserData(dataToUpdate, userID)
      .then((updatedUserData) => {
        if (updatedUserData.role === "admin") {
          navigate("/admin/account");
        } else if (updatedUserData.role === "student") {
          navigate("/student/account");
        } else {
          console.error("Unexpected user role:", updatedUserData.role);
          navigate("/unauthorized");
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Something went wrong",
          text: "Please try again",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating user data:", error);
      });
  };
  const downloadQRCode = () => {
    if (qrBoxRef.current) {
      html2canvas(qrBoxRef.current).then((canvas) => {
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${userData.id_number}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      });
    }
  };
  const InfoTable = ({ items, rowPadding }) => (
    <Table>
      <TableBody>
        {items.map(([label, value]) => (
          <TableRow key={label}>
            <TableCell
              component="th"
              scope="row"
              style={{ fontWeight: "bold", width: "40%", border: "none" }}
              padding={rowPadding}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {label}
              </Typography>
            </TableCell>
            <TableCell style={{ border: "none" }} padding={rowPadding}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 400, fontSize: "1.2rem" }}
              >
                {value}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const personalInfo = [
    ["Birthday", formatDate(userData.birthday, false)],
    ["Gender", userData.gender],
    ["Contact Number", userData.contact_number],
    ["Email", userData.email],
    ["Address", userData.address],
  ];

  const accountInfo = [
    ["Created At", formatDate(userData.created_at, false)],
    ["Updated At", formatDate(userData.updated_at, false)],
    ["Email Verified At", formatDate(userData.email_verified_at, false)],
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        align="center"
        sx={{ marginBottom: 5, marginTop: 2 }}
      >
        {userData.role == "admin" ? "Account " : "Student"} Details
      </Typography>
      <Grid
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"row"}
        alignItems={"center"}
        container
        spacing={2}
        direction="row"
      >
        <Grid item container spacing={3} lg={8}>
          <Grid
            pl={0}
            pt={0}
            xs={12}
            sm={4}
            md={3}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
          >
            <Avatar
              src={`http://127.0.0.1:8000/storage/${userData.profile_picture}`}
              sx={{ width: 150, height: 150, margin: "auto" }}
            >
              {userData.first_name[0]}
              {userData.last_name[0]}
            </Avatar>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={9}
            sx={{ boxShadow: 2, borderRadius: 2, bgcolor: "white" }}
            pb={2}
          >
 
            <Typography variant="h3">{`${userData.first_name} ${userData.middle_name} ${userData.last_name}`}</Typography>
            <InfoTable
              items={[
                ["Course", userData.course],
                ["Year Level", userData.year_level],
              ]}
              rowPadding={tableRowPadding}
            />
          </Grid>
          <Grid
            item
            xs={12}
            pb={2}
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              bgcolor: "white",
              marginTop: 2,
            }}
          >
            <Box justifyContent="space-between" display={"flex"}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Personal Information
              </Typography>
              <IconButton onClick={handleEdit} sx={{ marginRight: 2 }}>
                <EditIcon /> Edit
              </IconButton>
            </Box>
            <InfoTable items={personalInfo} rowPadding={tableRowPadding} />
          </Grid>
          <Grid
            item
            xs={12}
            pb={2}
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              bgcolor: "white",
              marginTop: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Account Information
            </Typography>
            <InfoTable items={accountInfo} rowPadding={tableRowPadding} />
          </Grid>
        </Grid>
        {userData.role == "student" && (
          <Grid
            item
            xs={12}
            lg={2.7}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
              Student ID Card
            </Typography>
            <Box
              ref={qrBoxRef}
              sx={{
                boxShadow: 2,
                borderRadius: 2,
                bgcolor: "white",
                padding: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginBottom: 2,
              }}
            >
              <QRCode value={userData.id_number} size={260} />
              <Typography
                variant="h2"
                sx={{ fontWeight: "bold" }}
                align="center"
              >
                {userData.id_number}
              </Typography>
            </Box>
            <Button variant="contained" onClick={downloadQRCode} fullWidth>
              Download QR
            </Button>
          </Grid>
        )}
      </Grid>

      <EditModal
        title="Edit Student Details"
        editableColumns={editableColumns}
        open={edit}
        handleClose={handleClose}
        rowData={userData}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default StudentAccount;

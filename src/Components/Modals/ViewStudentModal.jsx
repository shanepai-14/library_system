import React,{useRef} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QRCode from 'react-qr-code';
import { formatDate } from '../../Utils/helper';
import html2canvas from 'html2canvas';
const ViewStudentModal = ({ open, handleClose, data, tableRowPadding = 'none' }) => {
  if (!data) return null;
  
  const qrBoxRef = useRef(null);

  const downloadQRCode = () => {
    if (qrBoxRef.current) {
      html2canvas(qrBoxRef.current).then((canvas) => {
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${data.id_number}.png`;
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
              style={{ fontWeight: 'bold', width: '40%', border: 'none' }}
              padding={rowPadding}
            >
            <Typography variant='h6' sx={{fontWeight: 500}}>
            {label}
            </Typography>
            </TableCell>
            <TableCell style={{ border: 'none' }} padding={rowPadding}>
                <Typography  variant='subtitle2' sx={{fontWeight: 400, fontSize:"1.2rem"}}>
                {value}
                </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const personalInfo = [
    ['Birthday', formatDate(data.birthday, false)],
    ['Gender', data.gender],
    ["Email", data.email],
    ['Contact Number', data.contact_number],
    ['Address', data.address],
  ];

  const accountInfo = [
    ['Created At', formatDate(data.created_at, false)],
    ['Updated At', formatDate(data.updated_at, false)],
    ['Email Verified At', formatDate(data.email_verified_at)],
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg"  fullWidth>
      <DialogTitle>
        Student Details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor:"#F1F2F6"}}>
        <Grid container spacing={2} direction="row" pl={2} pt={3}>
          <Grid item container spacing={3} lg={8}>
            <Grid item xs={12} sm={4} md={3} sx={{ textAlign: 'center' }} >
              <Avatar
                src={data.profile_picture}
                sx={{ width: 150, height: 150, margin: 'auto' }}
              >
                {data.first_name[0]}
                {data.last_name[0]}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ boxShadow: 2,borderRadius:2,bgcolor:"white" }} pb={2} >
              <Typography variant="h3">{`${data.first_name} ${data.middle_name} ${data.last_name}`}</Typography>
              <InfoTable 
                items={[
                  ['Course', data.course],
                  ['Year Level', data.year_level],
                ]} 
                rowPadding={tableRowPadding}
              />
            </Grid>
            <Grid item xs={12} pb={2} sx={{ boxShadow: 2,borderRadius:2,bgcolor:"white", marginTop:2 }}>
              <Typography variant="h6" sx={{fontWeight: 700}}>Personal Information</Typography>
              <InfoTable items={personalInfo} rowPadding={tableRowPadding} />
            </Grid>
            <Grid item xs={12} pb={2} sx={{ boxShadow: 2,borderRadius:2,bgcolor:"white",marginTop:2 }}>
            <Typography variant="h6" sx={{fontWeight: 700}}>Account Information</Typography>
            <InfoTable items={accountInfo} rowPadding={tableRowPadding} />

            </Grid>
          </Grid>
          <Grid item xs lg={4} pl={0} sx={{display: 'flex', justifyContent: 'start', alignItems: 'center',flexDirection:"column"}}>
              <Typography variant="h4" align="center" sx={{marginBottom:4}}>Student ID Card</Typography>
              <Box ref={qrBoxRef} sx={{ boxShadow: 2,borderRadius:2,bgcolor:"white",padding:5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:"column",marginBottom:2}}>
                <QRCode value={data.id_number} size={260}/>
                <Typography variant="h2" sx={{fontWeight:"bold"}} align="center" >{data.id_number}</Typography>
            </Box>
            <Button  variant="contained" onClick={downloadQRCode} fullWidth >Download QR</Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentModal;
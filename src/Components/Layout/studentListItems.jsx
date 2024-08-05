import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavItem from "./NavItem";


const StudentListItems = () => (
  <React.Fragment>
    <NavItem 
      to="/student/dashboard" 
      icon={<DashboardIcon />} 
      primary="Dashboard" 
    />
    <NavItem 
      to="/student/issued-books" 
      icon={<LayersIcon />} 
      primary="Issued Books" 
    />
    <NavItem 
      to="/student/account" 
      icon={<AccountCircleIcon />} 
      primary="Account" 
    />
  </React.Fragment>
);

export default StudentListItems
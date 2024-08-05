import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from "@mui/icons-material/Layers";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FaceIcon from '@mui/icons-material/Face';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavItem from "./NavItem";


 const MainListItems = () => (
  <React.Fragment>
    <NavItem to="/admin/dashboard" icon={<DashboardIcon />} primary="Dashboard" />
    <NavItem to="/admin/categories" icon={<CategoryIcon />} primary="Category" />
    <NavItem to="/admin/authors" icon={<FaceIcon />} primary="Authors" />
    <NavItem to="/admin/books" icon={<LibraryBooksIcon />} primary="Books" />
    <NavItem to="/admin/bookloans" icon={<LayersIcon />} primary="Issue Books" />
    <NavItem to="/admin/attendance" icon={<CalendarMonthIcon />} primary="Attendance" />
    <NavItem to="/admin/students" icon={<PeopleIcon />} primary="Students" />
    <NavItem to="/admin/account" icon={<AccountCircleIcon />} primary="Account" />
  </React.Fragment>
);

export default MainListItems;

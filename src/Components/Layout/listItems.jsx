import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from "@mui/icons-material/Layers";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FaceIcon from '@mui/icons-material/Face';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SubjectIcon from '@mui/icons-material/Subject';
import NavItem from "./NavItem";


 const MainListItems = () => (
  <React.Fragment>
    <NavItem to="/admin/dashboard" icon={<DashboardIcon />} primary="Dashboard" />
    <NavItem to="/admin/subjects" icon={<SubjectIcon />} primary="Subjects" />
    <NavItem to="/admin/categories" icon={<CategoryIcon />} primary="Category" />
    <NavItem to="/admin/authors" icon={<FaceIcon />} primary="Authors" />
    <NavItem to="/admin/books" icon={<LibraryBooksIcon />} primary="Books" />
    <NavItem to="/admin/bookloans" icon={<LayersIcon />} primary="Issue Books" />
    <NavItem to="/admin/attendance" icon={<CalendarMonthIcon />} primary="Attendance" />
    <NavItem to="/admin/students" icon={<PeopleIcon />} primary="Students" />
    <NavItem to="/admin/account" icon={<AccountCircleIcon />} primary="Account" />
    <NavItem to="/admin/post" icon={<AnnouncementIcon />} primary="Post" />
  </React.Fragment>
);

export default MainListItems;

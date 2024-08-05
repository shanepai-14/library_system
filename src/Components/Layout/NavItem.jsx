import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const NavItem = ({ to, icon, primary }) => {
    const location = useLocation();
    const isSelected = location.pathname === to;
  
    return (
      <ListItemButton
        component={Link}
        to={to}
       
        sx={{
          backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
          '&:hover': {
            backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItemButton>
    );
  };

  export default NavItem;
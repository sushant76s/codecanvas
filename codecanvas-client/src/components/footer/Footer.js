import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Footer = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="body2" color="inherit" sx={{ flexGrow: 1 }}>
          Developed by Sushant
        </Typography>
        <Typography variant="body2" color="inherit">
          &copy; {new Date().getFullYear()} sushant76s
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;

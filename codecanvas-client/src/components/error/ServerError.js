import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box } from "@mui/material";
// import { Link } from 'react-router-dom';

const ServerError = ({ status }) => {
  return (
    <>
      {!status ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The server seems to be unavailable.
          </Typography>
          {/* <Button variant="contained" color="primary" component={Link} to="/">
                Go back to Home
              </Button> */}
        </Box>
      ) : null}
    </>
  );
};

ServerError.propTypes = {
  status: PropTypes.bool,
};

export default ServerError;

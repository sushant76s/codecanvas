import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid } from "@mui/material";

const EmptyTableContent = ({ isEmpty }) => {
  return (
    <>
      {isEmpty ? (
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: "bold",
          }}
        >
          <Typography variant="body1">Table is Empty!</Typography>
        </Grid>
      ) : null}
    </>
  );
};

EmptyTableContent.propTypes = {
  isEmpty: PropTypes.bool,
};

export default EmptyTableContent;

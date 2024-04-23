import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const EmptyTableContent = ({ isEmpty }) => {
  return (
    <>
      {isEmpty ? (
        <Typography
          component="div"
          sx={{
            mt: 2,
            mb: 2,
            alignItems: "center",
            fontWeight: "bold",
            display: "flex",
            justifyContent: 'center'
          }}
        >
          Table is Empty!
        </Typography>
      ) : null}
    </>
  );

};

EmptyTableContent.propTypes = {
  isEmpty: PropTypes.bool,
};

export default EmptyTableContent;

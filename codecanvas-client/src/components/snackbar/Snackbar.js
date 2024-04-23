import * as React from "react";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";

Snackbar.propTypes = {
  status: PropTypes.bool,
  message: PropTypes.string,
  handleDialog: PropTypes.func,
};

export default function Snackbar({ status, message }) {
  const vertical = "top";
  const horizontal = "right";
  const [open, setOpen] = React.useState(status);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message="Snackbar"
      key={vertical + horizontal}
      autoHideDuration={2000}
    />
  );
}

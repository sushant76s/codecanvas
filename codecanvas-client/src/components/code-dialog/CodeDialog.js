import React from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

CodeDialog.propTypes = {
  status: PropTypes.bool,
  handleDialog: PropTypes.func,
  data: PropTypes.object,
};

export default function CodeDialog({ status, handleDialog, data }) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(data.sourceCode)
      .then(() => {
        console.log("Code copied!");
      })
      .catch((err) => {
        console.error("Failed to copy value: ", err);
      });
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleDialog}
        aria-labelledby="customized-dialog-title"
        open={status}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Source Code
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            width="500px"
            // height="100%"
            // border="1px solid #ccc"
            overflow="auto"
            sx={{ pt: 1 }}
          >
            <TextField
              id="outlined-multiline-static"
              label={data.language}
              multiline
              rows={10}
              defaultValue={data.sourceCode}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: "100%" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCopy}>
            Copy Code
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

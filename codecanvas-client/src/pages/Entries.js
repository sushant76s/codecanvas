import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CodeDialog from "../components/code-dialog/CodeDialog";
import EmptyTableContent from "../components/empty-content/EmptyTableContent";
import ServerError from "../components/error/ServerError";
import Linear from "../components/progress/Linear";

import { fetchEntries } from "../redux/actions/entriesActions";
import { serverStatus } from "../redux/actions/serverStatusActions";

const columns = [
  { id: "username", label: "USER", minWidth: 170 },
  {
    id: "language",
    label: "CODE LANGUAGE",
    minWidth: 100,
    align: "center",
  },
  {
    id: "stdin",
    label: "INPUT",
    minWidth: 170,
    align: "center",
  },
  {
    id: "stdout",
    label: "OUTPUT",
    minWidth: 170,
    align: "center",
  },
  {
    id: "createdAt",
    label: "SUBMISSION TIME",
    minWidth: 170,
    align: "center",
  },
  {
    id: "sourceCode",
    label: "SOURCE CODE",
    minWidth: 170,
    align: "right",
  },
];

const Entries = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [codeData, setCodeData] = useState({});

  useEffect(() => {
    dispatch(fetchEntries());
    dispatch(serverStatus());
  }, [dispatch]);

  const tableData = useSelector((state) => state.EntriesReducer.entries);
  const serverState = useSelector((state) => state.ServerStatusReducer.status);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const backToEditor = async () => {
    navigate("/editor");
  };
  const backToHome = async () => {
    navigate("/");
  };

  const handleCodeDialog = (data) => {
    setCodeData(data);
    setDialogStatus(!dialogStatus);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tableData && tableData.length === 0) {
        setEmpty(true);
      }
    }, 5 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [tableData]);

  if (!serverState) {
    return <ServerError status={serverState} />;
  }

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h5">SUBMISSIONS</Typography>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              onClick={backToEditor}
              variant="outlined"
              sx={{ width: "20%" }}
            >
              Editor
            </Button>
            <Button
              onClick={backToHome}
              variant="outlined"
              sx={{ width: "20%" }}
            >
              Home
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }} />
      {tableData && tableData.length === 0 && <Linear />}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData &&
                tableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {/* {column.format && typeof value === "number"
                              ? column.format(value)
                              : value} */}
                              {column.id !== "sourceCode" ? (
                                value
                              ) : (
                                <Button onClick={() => handleCodeDialog(row)}>
                                  View Code
                                </Button>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
            {empty && (
              <EmptyTableContent
                isEmpty={tableData && tableData.length === 0}
              />
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableData && tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <CodeDialog
        status={dialogStatus}
        handleDialog={handleCodeDialog}
        data={codeData}
      />
    </>
  );
};

export default Entries;

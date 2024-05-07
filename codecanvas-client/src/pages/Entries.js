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
import { getSubmittedData } from "../redux/actions/entriesActions";
import EmptyTableContent from "../components/empty-content/EmptyTableContent";
import { serverCheck } from "../services/HealthCheck";
import ServerError from "../components/error/ServerError";

import { SERVER_ENDPOINT } from "../config-global";

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
    // format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "stdout",
    label: "OUTPUT",
    minWidth: 170,
    align: "center",
    // format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "createdAt",
    label: "SUBMISSION TIME",
    minWidth: 170,
    align: "center",
    // format: (value) => value.toFixed(2),
  },
  {
    id: "sourceCode",
    label: "SOURCE CODE",
    minWidth: 170,
    align: "right",
    // format: (value) => value.toFixed(2),
  },
];

// function createData(user, lang, inp, out, code) {
//   // const density = population / size;
//   return { username: user, code_language: lang, stdIn: inp, stdOut: out, code };
// }

// const crows = [
//   createData("John", "C++", 36, 6, "Hello, World!"),
//   createData("John", "C++", 36, 6, "Hello, World!"),
// ];

const Entries = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [codeData, setCodeData] = useState("");
  const submittedData = useSelector((state) => state.TableDataReducer.total);
  const [rows, setRows] = useState(null);

  const [serverStatus, setServerStatus] = useState(true);

  const [allSnippets, setAllSnippets] = useState([]);

  // useEffect(() => {
  //   dispatch(getSubmittedData());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (submittedData !== null) {
  //     setRows(submittedData);
  //   }
  // }, [submittedData]);

  const fetchSnippets = async () => {
    try {
      const res = await fetch(`${SERVER_ENDPOINT}/get-snips`, {
        cache: "no-store",
      });
      if (!res.ok) {
        // Handle error (e.g., render a "not found" component)
        return;
      }
      const data = await res.json();

      let snippets = [];
      if (data.db) {
        snippets = data.db;
      } else {
        snippets = data.redis.map((snippet) => JSON.parse(snippet));
        snippets.sort((a, b) => b.id - a.id);
      }

      snippets.forEach((snippet) => {
        snippet.createdAt = new Date(snippet.createdAt).toLocaleString(
          "en-IN",
          {
            timeZone: "Asia/Kolkata",
            hour12: false,
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        );
        snippet.stdout = snippet.stdout
          ? removeNonPrintableChars(snippet.stdout)
          : "pending";
      });

      setAllSnippets(snippets);
    } catch (error) {
      console.error("Error fetching snippets:", error);
      // Handle error (e.g., render an error message)
    }
  };

  const removeNonPrintableChars = (str) => {
    // Implement removeNonPrintableChars logic here
    // For example, you can use a regex to remove control characters
    return str.replace(/[\x00-\x1F\x7F]/g, "");
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleCodeDialog = (data) => {
    setCodeData(data);
    setDialogStatus(!dialogStatus);
  };

  // console.log("All snips: ", allSnippets);

  // const isNotFound = rows && rows.length === 0;

  const isNotFound = allSnippets && allSnippets.length === 0;

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await serverCheck();
        if (!response.data.status) {
          setServerStatus(false);
        }
      } catch (error) {
        setServerStatus(false);
      }
    };

    checkServerStatus();
  }, []);

  if (serverStatus === false) {
    return <ServerError status={serverStatus} />;
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
              {allSnippets &&
                allSnippets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
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
            <EmptyTableContent isEmpty={isNotFound} />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={allSnippets && allSnippets.length}
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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import CodeMirror, { lineNumbers } from "@uiw/react-codemirror";
import {
  langNames,
  langs,
  loadLanguage,
} from "@uiw/codemirror-extensions-langs";

import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { sublime } from "@uiw/codemirror-theme-sublime";

import { submitEntry } from "../redux/actions/entriesActions";
import { languages } from "../assets/data/languages";
import { serverStatus } from "../redux/actions/serverStatusActions";
import ServerError from "../components/error/ServerError";
import MonacoEditor from "../components/monaco-editor/MonacoEditor";

import { SERVER_ENDPOINT } from "../config-global";

const Editor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState({
    id: 1,
    name: "C++",
    name2: "cpp",
  });
  const [code, setCode] = useState("");
  const [stdInput, setStdInput] = useState("");
  const [stdOutput, setStdOutput] = useState("");

  // Loading button states
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    dispatch(serverStatus());
  }, [dispatch]);

  const serverState = useSelector((state) => state.ServerStatusReducer.status);

  if (!serverState && !serverState) {
    return <ServerError status={serverState && serverState} />;
  }

  const handleSubmitCode = () => {
    setSubmitLoading(true);
    const data = {
      username: username,
      language: language.name,
      input: stdInput,
      code: code,
    };
    try {
      if (data.username !== "" && data.code !== "") {
        dispatch(submitEntry(data));
        setTimeout(() => {
          setSubmitLoading(false);
          navigate("/entries");
        }, 1000);
      } else {
        alert("username or code is empty!");
        setSubmitLoading(false);
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log("Error: ", error);
    }
  };

  const redirectToAllSubmissions = async () => {
    navigate("/entries");
  };

  const handleSetLanguage = (e) => {
    const selectedLanguage = languages.find(
      (option) => option.id === e.target.value
    );
    setLanguage({
      id: e.target.value,
      name: selectedLanguage ? selectedLanguage.name : "",
      name2: selectedLanguage ? selectedLanguage.name2 : "cpp",
    });
  };

  const handleRunCode = async () => {
    setRunLoading(true);
    setStdOutput("");
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/run-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language.name,
          input: stdInput,
          code: code,
        }),
      });

      const data = await response.json();
      setStdOutput(data.output);
      setRunLoading(false);
      // console.log("Output: ", data);
    } catch (error) {
      setRunLoading(false);
      console.error("Error:", error);
    }
  };

  // console.log("l: ", language?.name2);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                required
                label="Select Language"
                value={language?.id || ""}
                onChange={(e) => handleSetLanguage(e)}
                sx={{ width: "100%" }}
                // defaultValue="C++"
              >
                {languages.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <CodeMirror
                value={code}
                height="400px"
                onChange={setCode}
                theme={sublime}
                extensions={[loadLanguage(language?.name2 || "cpp")]}
              />
              {/* <MonacoEditor /> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Input"
                multiline
                rows={6}
                variant="outlined"
                value={stdInput}
                onChange={(e) => setStdInput(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Chip
                      label="Status"
                      variant="outlined"
                      sx={{ width: "100%", borderRadius: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={compileStatus}
                      variant="outlined"
                      sx={{ width: "100%", borderRadius: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                label="Output"
                multiline
                rows={6}
                variant="outlined"
                value={stdOutput}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                disabled={runLoading}
                onClick={handleRunCode}
                fullWidth
                endIcon={
                  runLoading && <CircularProgress size={20} color="inherit" />
                }
              >
                {runLoading ? "Running..." : "Run Code"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                disabled={submitLoading}
                onClick={handleSubmitCode}
                fullWidth
                endIcon={
                  submitLoading && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              >
                {submitLoading ? "Submitting..." : "Submit Code"}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={redirectToAllSubmissions}
                fullWidth
              >
                All submissions
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Editor;

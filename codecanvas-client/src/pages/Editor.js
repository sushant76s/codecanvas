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
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { submitData } from "../redux/actions/entriesActions";
import { getSubmission, submitCode } from "../services/JudgeApi";
import { languages } from "../assets/data/languages";
import { serverCheck } from "../services/HealthCheck";
import ServerError from "../components/error/ServerError";

const Editor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState(null);
  const [code, setCode] = useState("");
  const [stdInput, setStdInput] = useState("");
  const [stdOutput, setStdOutput] = useState("");

  // Loading button states
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [compileStatus, setCompileStatus] = useState("");

  const [serverStatus, setServerStatus] = useState(true);
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

  // const handleRunCode = async () => {
  //   try {
  //     setRunLoading(true);
  //     setCompileStatus("");
  //     const codeData = {
  //       language_id: language?.id || null,
  //       source_code: code,
  //       stdin: stdInput,
  //     };
  //     const submitResponse = await submitCode(codeData);
  //     let submissionResponse;
  //     let state = "";

  //     if (submitResponse.status === 200) {
  //       const token = submitResponse.data.token;
  //       do {
  //         submissionResponse = await getSubmission(token);
  //         // console.log("Submission Response: ", submissionResponse);
  //         if (submissionResponse && submissionResponse?.status === 200) {
  //           setCompileStatus(submissionResponse.data.status.description);
  //           if (submissionResponse.data.status.description === "Accepted") {
  //             setStdOutput(submissionResponse.data.stdout);
  //             setRunLoading(false);
  //             break;
  //           }
  //           state = submissionResponse.data.status.description;
  //         } else {
  //           setStdOutput("Execution failed try again.");
  //           setCompileStatus("Failed, try again.");
  //           break;
  //         }
  //         await new Promise((resolve) => setTimeout(resolve, 2000));
  //       } while (state === "Processing");
  //     } else {
  //       console.log("Error while submitting code.");
  //     }
  //     setRunLoading(false);
  //     if (submissionResponse?.data?.status.description !== "Accepted") {
  //       setCompileStatus(submissionResponse?.data?.status.description);
  //       setStdOutput(submissionResponse?.data?.stderr);
  //     }
  //   } catch (error) {
  //     console.log("Error running code: ", error);
  //   }
  // };

  const handleSubmitCode = () => {
    setSubmitLoading(true);
    // const data = {
    //   username: username,
    //   code_language: language?.name ? language.name : "NULL",
    //   stdIn: stdInput,
    //   stdOut: stdOutput,
    //   code: code,
    // };

    const data = {
      username: username,
      language: language.name,
      input: stdInput,
      code: code,
    };
    try {
      dispatch(submitData(data));
      setTimeout(() => {
        setSubmitLoading(false);
        navigate("/entries");
      }, 1000);
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
    });
  };

  // console.log("status: ", compileStatus);

  const handleRunCode = async () => {
    setRunLoading(true);
    try {
      const response = await fetch("http://localhost:3030/api/run-code", {
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
      console.log("Output: ", data);
    } catch (error) {
      setRunLoading(false);
      console.error("Error:", error);
    }
  };

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
                theme={vscodeDark}
              />
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
              <Button
                variant="outlined"
                color="primary"
                onClick={redirectToAllSubmissions}
                fullWidth
              >
                All submissions
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
            {/* <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={redirectToAllSubmissions}
                fullWidth
              >
                All submissions
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Editor;

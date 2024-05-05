import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  CardHeader,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import code from "../assets/images/code.png";
import ApplicationBar from "../components/application-bar/ApplicationBar";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocation = location.pathname;

  const openEditor = () => {
    navigate("/editor");
  };

  const openSubmissions = () => {
    navigate("/entries");
  };

  return (
    <>
      <ApplicationBar />
      <Container sx={{ py: 4, px: 0 }}>
        {currentLocation === "/" && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ minWidth: 275 }}>
                    {/* <CardHeader title="Code Playground" /> */}
                    <CardContent>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        CodeCanvas: A cloud-based code playground where you can
                        write, run, and experiment with code in various
                        programming languages, all within your browser.
                      </Typography>
                      <Divider />
                      <CardMedia
                        component="img"
                        height="385"
                        image={code}
                        alt="Code Playground"
                        sx={{ p: 2 }}
                      />
                    </CardContent>
                    {/* <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions> */}
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardHeader title="EDITOR" />
                    <CardContent>
                      {/* <CardMedia
                        component="img"
                        height="100"
                        image={img1}
                        alt="Paella dish"
                      /> */}
                      <Typography>
                        Within the 'Editor' page, you can write, edit, and
                        experiment with code in various programming languages.
                        This page provides tools for coding and debugging,
                        enabling you to create and modify code effortlessly.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "right" }}>
                      <Button
                        variant="outlined"
                        onClick={openEditor}
                        size="small"
                      >
                        Get Started
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardHeader title="SUBMISSIONS" />
                    <CardContent>
                      {/* <CardMedia
                        component="img"
                        height="100"
                        image={img1}
                        alt="Paella dish"
                      /> */}
                      <Typography>
                        The 'Submissions' page is where you can find all code
                        submissions by various users. You can view and copy the
                        code from this page.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "right" }}>
                      <Button
                        variant="outlined"
                        onClick={openSubmissions}
                        size="small"
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Outlet />
      </Container>
    </>
  );
};

export default Home;

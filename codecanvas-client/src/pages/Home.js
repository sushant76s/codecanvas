import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Container,
  Grid,
  Paper,
  Switch,
  ThemeProvider,
  createTheme,
  Card,
  CardActions,
  CardContent,
  Button,
  CardHeader,
  CardMedia,
} from "@mui/material";
import NavBar from "../components/nav-bar/NavBar";
import img1 from "../assets/images/img1.png";
import Footer from "../components/footer/Footer";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const currentLocation = location.pathname;

  // Function to toggle between light and dark theme
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Define the theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const openEditor = () => {
    navigate("/editor");
  };

  const openSubmissions = () => {
    navigate("/entries");
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Container sx={{ py: 2 }}>
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
                      <CardMedia
                        component="img"
                        height="300"
                        image={img1}
                        alt="Code Playground"
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
                      <CardMedia
                        component="img"
                        height="100"
                        image={img1}
                        alt="Paella dish"
                      />
                    </CardContent>
                    <CardActions>
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
                      <CardMedia
                        component="img"
                        height="100"
                        image={img1}
                        alt="Paella dish"
                      />
                    </CardContent>
                    <CardActions>
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
      <Footer />
    </ThemeProvider>
  );
};

export default Home;

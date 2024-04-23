import React, { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));
export const EditorPage = Loadable(lazy(() => import("../pages/Editor")));
export const EntriesPage = Loadable(lazy(() => import("../pages/Entries")));
export const HomePage = Loadable(lazy(() => import("../pages/Home")));

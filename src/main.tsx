import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AriVideoExportedPreviewApp from "./ari-video/preview/AriVideoExportedPreviewApp";
import AriVideoPreviewApp from "./ari-video/preview/AriVideoPreviewApp";
import ImmersiveExperienceApp from "./immersive/ImmersiveExperienceApp";
import "./styles/global.css";

function normalizeRoute(route: string) {
  return route.replace(/\/+$/, "") || "/";
}

function getCurrentRoute() {
  const pathnameRoute = normalizeRoute(window.location.pathname);
  const hashRoute = window.location.hash.startsWith("#/")
    ? normalizeRoute(window.location.hash.slice(1))
    : null;

  return hashRoute ?? pathnameRoute;
}

function RootRouter() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const RootComponent = route === "/ari-video"
    ? AriVideoPreviewApp
    : route === "/ari-video/exported"
      ? AriVideoExportedPreviewApp
      : route === "/experience" || route === "/immersive"
        ? ImmersiveExperienceApp
        : App;

  return <RootComponent />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);

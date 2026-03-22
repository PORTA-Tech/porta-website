import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AriVideoExportedPreviewApp from "./ari-video/preview/AriVideoExportedPreviewApp";
import AriVideoPreviewApp from "./ari-video/preview/AriVideoPreviewApp";
import ImmersiveExperienceApp from "./immersive/ImmersiveExperienceApp";
import "./styles/global.css";

function normalizeRoute(route: string) {
  return route.replace(/\/+$/, "") || "/";
}

const pathnameRoute = normalizeRoute(window.location.pathname);
const hashRoute = window.location.hash.startsWith("#/")
  ? normalizeRoute(window.location.hash.slice(1))
  : null;
const route = hashRoute ?? pathnameRoute;

const RootComponent = route === "/ari-video"
  ? AriVideoPreviewApp
  : route === "/ari-video/exported"
    ? AriVideoExportedPreviewApp
    : route === "/experience" || route === "/immersive"
      ? ImmersiveExperienceApp
    : App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AriVideoExportedPreviewApp from "./ari-video/preview/AriVideoExportedPreviewApp";
import AriVideoPreviewApp from "./ari-video/preview/AriVideoPreviewApp";
import ImmersiveExperienceApp from "./immersive/ImmersiveExperienceApp";
import "./styles/global.css";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const RootComponent = pathname === "/ari-video"
  ? AriVideoPreviewApp
  : pathname === "/ari-video/exported"
    ? AriVideoExportedPreviewApp
    : pathname === "/experience" || pathname === "/immersive"
      ? ImmersiveExperienceApp
    : App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);

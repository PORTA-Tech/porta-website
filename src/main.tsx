import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AriVideoPreviewApp from "./ari-video/preview/AriVideoPreviewApp";
import "./styles/global.css";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const RootComponent = pathname === "/ari-video" ? AriVideoPreviewApp : App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);

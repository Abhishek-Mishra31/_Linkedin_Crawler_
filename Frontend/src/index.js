import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ScrapState from "./context/scrapeApi/ScrapState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ScrapState>
      <App />
    </ScrapState>
  </React.StrictMode>
);

reportWebVitals();

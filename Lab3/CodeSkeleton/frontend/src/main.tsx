import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import App from "./App";
import "./index.css";
import { SavedJobsProvider } from "./components/SavedJobsContext";
import { SectorProvider } from "./components/SectorContext";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>  {/* ✅ Wrap the app here */}
      <SavedJobsProvider>
        <SectorProvider>
          <App />
        </SectorProvider>
      </SavedJobsProvider>
    </BrowserRouter>
  </React.StrictMode>
);

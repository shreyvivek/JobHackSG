import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  
import App from "./App";
import "./index.css";
import { SavedJobsProvider } from "./components/SavedJobsContext";
import { SectorProvider } from "./components/SectorContext";
import { UserProvider } from "./components/UserContext";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SavedJobsProvider>
          <SectorProvider>
            <App />
          </SectorProvider>
        </SavedJobsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

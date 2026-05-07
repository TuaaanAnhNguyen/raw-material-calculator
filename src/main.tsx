import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import AddPage from "./AddPage.tsx";

const superDuperSecretAddPageUrl = import.meta.env.VITE_ADD_PAGE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path={`/${superDuperSecretAddPageUrl}`} element={<AddPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);

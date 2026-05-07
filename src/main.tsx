import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddPage from "./AddPage.tsx";

const superDuperSecretAddPageUrl = import.meta.env.VITE_ADD_PAGE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/raw-material-calculator">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path={`/${superDuperSecretAddPageUrl}`} element={<AddPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

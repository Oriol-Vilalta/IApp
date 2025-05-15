import ReactDOM from "react-dom/client";
import { GlobalStyles } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import Navbar from "./NavBar/NavBar";
import ModelsMainPage from "./ModelsMainPage/ModelsMainPage";
import DatasetsMainPage from "./DatasetsMainPage/DatasetsMainPage";
import Model from "./ModelsMainPage/Models/Model";
import Dataset from "./Dataset/Dataset";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <>
    <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
    <Navbar className="navbar"/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelsMainPage />} />
        <Route path="/models">
          <Route index element={<ModelsMainPage />} />
          <Route path=":id" element={<Model />} />
        </Route>
        <Route path="/datasets">
          <Route index element={<DatasetsMainPage />} />
          <Route path=":id" element={<Dataset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);
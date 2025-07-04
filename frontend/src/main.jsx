import ReactDOM from "react-dom/client";
import { GlobalStyles } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import Navbar from "./Navbar/Navbar";
import ModelsPage from "./MainPages/Models";
import DatasetsPage from "./MainPages/Datasets";

import Model from "./Model/Model";
import Dataset from "./Dataset/Dataset";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <>
    <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
    <Navbar className="navbar"/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelsPage />} />
        <Route path="/models">
          <Route index element={<ModelsPage />} />
          <Route path=":id" element={<Model />} />
        </Route>
        <Route path="/datasets">
          <Route index element={<DatasetsPage />} />
          <Route path=":id" element={<Dataset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);
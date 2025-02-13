import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./app";
import './index.css'
import ModelsMainPage from "./ModelsMainPage/ModelsMainPage";
import DatasetsMainPage from "./DatasetsMainPage/DatasetsMainPage";
import Model from "./ModelsMainPage/Models/Model"
import Dataset from "./DatasetsMainPage/Dataset/Dataset"

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/models" element={<ModelsMainPage/>}>
        <Route index element={<ModelsMainPage/>}/>
        <Route path=":id" element={<Model/>}/>
      </Route>
      <Route path="/datasets" element={<DatasetsMainPage/>}>
        <Route index element={<DatasetsMainPage/>}/>
        <Route path=":id" element={<Dataset></Dataset>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);
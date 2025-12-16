// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import Account from "./pages/Account";

import Works from "./pages/work/Works";


import ProjectsList from "./pages/work/ProjectsList";
import Activity from "./pages/work/Activity";
import CreateIntro from "./pages/work/CreateIntro";
import CreateProject from "./pages/work/CreateProject";
import ProjectDetails from "./pages/work/ProjectDetails";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Work + nested pages */}
        <Route path="/work" element={<Works />}>
          <Route index element={<ProjectsList />} />
          <Route path="activity" element={<Activity />} />
          <Route path="create" element={<CreateIntro />} />
          <Route path="create/new" element={<CreateProject />} />
          <Route path="project/:id" element={<ProjectDetails />} />
        </Route>

        {/* Account */}
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

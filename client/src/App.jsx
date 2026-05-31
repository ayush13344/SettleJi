import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import MainLayout from "./components/MainLayout";
import Dashboard from "./components/DashBoard";
import GroupsPage from "./components/GroupsPage";
import GroupForm from "./components/GroupForm";
import Trips from "./components/Trips";
import AuthPage from "./components/AuthPage";
import ExpensePage from "./components/ExpensePage";
import CalculateBalance from "./components/CalculateBalance";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/form" element={<GroupForm />} />
          {/* ✅ groupId param so ExpensePage can read it */}
          <Route path="/expense/:groupId" element={<ExpensePage />} />
          <Route path="/trips/:id" element={<Trips />} />
          {/* ✅ New CalculateBalance route */}
          <Route path="/calculate-balance/:id" element={<CalculateBalance />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LandingPage from "@/pages/LandingPage";
import AppLoader from "@/components/AppLoader";
import EmployeesPage from "@/pages/EmployeesPage";
import EmployeeDetailPage from "@/pages/EmployeeDetailPage";
import InsightsPage from "@/pages/InsightsPage";

function App() {
  const hasVisited = sessionStorage.getItem("visited") === "true";
  const [showLoader, setShowLoader] = useState(!hasVisited);
  const [loaderDone, setLoaderDone] = useState(hasVisited);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
    setShowLoader(false);
  }, []);

  return (
    <>
      {showLoader && <AppLoader onComplete={handleLoaderComplete} />}
      <Routes>
        <Route
          path="/"
          element={
            hasVisited ? <Navigate to="/employees" replace /> : <LandingPage />
          }
        />
        <Route element={<Layout />}>
          <Route
            path="/employees"
            element={loaderDone ? <EmployeesPage /> : null}
          />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

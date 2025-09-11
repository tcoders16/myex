// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import AppHeader from "./components/chrome/AppHeader";
import AppFooter from "./components/chrome/AppFooter";
import { useEffect, useState } from "react";
// 👆 make sure the path matches where you saved the wizard component

function App() {
    // --- backend health ---
  const [backendOk, setBackendOk] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("http://127.0.0.1:4000/api/healthz"); // adjust if different
        if (!alive) return;
        setBackendOk(r.ok);
      } catch {
        if (!alive) return;
        setBackendOk(false);
      } finally {
        if (!alive) return;
        setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [2000]); // re-check every 2s

  return (
    <BrowserRouter>
      <AppHeader
        // Use the new chip prop

        // (If you still want the old pill, pass these too)


        // Header nav
        showBack={true}
        backTo="/"


      />


      <Routes>
        <Route path="/" element={<Home font="chakra-petch-regular" />} />
      </Routes>
      <AppFooter />
    </BrowserRouter>
  );
}

export default App;
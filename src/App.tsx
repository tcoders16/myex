// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AppHeader from "./components/chrome/AppHeader";
import AppFooter from "./components/chrome/AppFooter";
import Test from "./pages/Test"
export default function App() {
  return (
    <BrowserRouter>
      <AppHeader showBack backTo="/" />
      <Routes>
        <Route path="/" element={<Home font="chakra-petch-regular" />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <AppFooter />
    </BrowserRouter>
  );
}
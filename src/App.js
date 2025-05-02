import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify
import Loading from "./components/subcomponent/Loading"; // Pastikan ini **tidak lazy** untuk menghindari loop

// Lazy load components
const Root = lazy(() => import("./components/Root"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Login = lazy(() => import("./components/Login"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Notifikasi Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

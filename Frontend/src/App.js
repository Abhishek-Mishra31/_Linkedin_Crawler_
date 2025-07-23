import "./App.css";
import { useEffect, useContext, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import scrapcontext from "./context/scrapeApi/ScrapContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

const AppContent = ({ authenticated, setAuthenticated }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
    setLoading(false);
  }, [setAuthenticated]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar Isauthenticated={authenticated} />
      <Routes>
        <Route
          path="/dashboard"
          element={
            authenticated ? (
              <Dashboard />
            ) : (
              <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            !authenticated ? <Register /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/login"
          element={
            !authenticated ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/about"
          element={
            !authenticated ? <About /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/contact"
          element={
            !authenticated ? <Contact /> : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/"
          element={
            authenticated ? <Navigate to="/dashboard" replace /> : <HomePage />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  const { authenticated, setAuthenticated } = useContext(scrapcontext);

  return (
    <div className="App">
      <Router>
        <AppContent
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
      </Router>
    </div>
  );
}

export default App;

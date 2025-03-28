import "./App.css";
import { useEffect, useContext } from "react";
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
} from "react-router-dom";

function App() {
  const { authenticated, setAuthenticated } = useContext(scrapcontext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  });

  return (
    <div className="App">
      <Router>
        <Navbar authenticated={authenticated} />
        <Routes>
          <Route
            exact
            path="/dashboard"
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route exact path="/register" element={<Register />} />
          <Route
            exact
            path="/login"
            element={authenticated ? <Navigate to="/dashboard" /> : <Login />}
          />

          <Route
            exact
            path="/"
            element={
              authenticated ? <Navigate to="/Dashboard" /> : <HomePage />
            }
          />
          <Route
            exact
            path="/about"
            element={authenticated ? <Navigate to="/Dashboard" /> : <About />}
          />
          <Route
            exact
            path="/contact"
            element={authenticated ? <Navigate to="/Dashboard" /> : <Contact />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

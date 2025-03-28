import { useState, useEffect } from "react";
import scrapcontext from "./ScrapContext";
const host = process.env.REACT_APP_URL;

const ScrapState = (props) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, []);

  const userSignup = async (name, email, password) => {
    const signupUrl = `${host}/user/signup`;
    const response = await fetch(signupUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await response.json();
    return result;
  };

  const userLogin = async (email, password) => {
    const loginUrl = `${host}/user/login`;
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (result.success) {
      localStorage.setItem("token", result.token);
      setAuthenticated(true);
    }

    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
  };

  const scrapeData = async (profileUrl) => {
    const scrapeUrl = `${host}/scrape`;
    const response = await fetch(scrapeUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ profileUrl }),
    });
    const result = await response.json();
    return result;
  };

  const contactMe = async (name, email, message) => {
    const contactUrl = `${host}/contact`;
    const response = await fetch(contactUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();
    return result;
  };
  return (
    <scrapcontext.Provider
      value={{
        authenticated,
        setAuthenticated,
        logout,
        userSignup,
        userLogin,
        scrapeData,
        contactMe,
      }}
    >
      {props.children}
    </scrapcontext.Provider>
  );
};

export default ScrapState;

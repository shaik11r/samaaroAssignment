import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authtoken"));
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // const URL = "https://chatbackendapi.onrender.com"; BACKEND DEPLOYEMENT LINK IT IS WORKING
  const URL = "http://localhost:5000";
  const signUpFunction = async (email, username, password) => {
    const response = await fetch(`${URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    });
    const data = await response.json();
    if (data.errors && data.errors.length > 0) {
      alert(data.errors[0].msg);
    } else if (data.error) {
      alert(data.error);
    } else {
      setMessage(data.message);
      setTimeout(() => {
        navigate("/signin");
        setMessage("");
      }, 1000);
    }
  };

  const signInFunction = async (email, password) => {
    const response = await fetch(`${URL}/api/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await response.json();
    const token = response.headers.get("authtoken");
    if (data.errors && data.errors.length > 0) {
      alert(data.errors[0].msg);
    } else if (data.error) {
      alert(data.error);
    } else {
      console.log(data.message, token);
      localStorage.setItem("authtoken", token);
      setToken(token);
      setMessage(data.message);
      setTimeout(() => {
        navigate("/dashboard");
        setMessage("");
      }, 1000);
    }
  };

  return (
    <userContext.Provider value={{ signUpFunction, signInFunction, token, message }}>
      {children}
    </userContext.Provider>
  );
};
export { userContext, UserContextProvider };

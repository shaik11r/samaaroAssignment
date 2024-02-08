import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authtoken"));
  const navigate = useNavigate();

  const signUpFunction = async (email, username, password) => {
    const response = await fetch("http://localhost:5000/api/signup", {
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
    if (data.error) {
      alert(data.error);
    } else {
      console.log(data.message);
      navigate("/signin");
    }
  };

  const signInFunction = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/signin", {
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
    if (data.error) {
      alert(data.error);
    }
     else {
      console.log(data.message, token);
      localStorage.setItem("authtoken", token);
      setToken(token);
      navigate("/dashboard");
    }
  };

  return (
    <userContext.Provider value={{ signUpFunction, signInFunction, token }}>
      {children}
    </userContext.Provider>
  );
};
export { userContext, UserContextProvider };

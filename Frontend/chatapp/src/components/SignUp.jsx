import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../Providers/UserContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { signUpFunction } = useContext(userContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    signUpFunction(email, username, password);
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  return (
    <div className="relative h-screen">
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-3xl mb-5 font-thin">register to chatApp</h1>
            <div className="mb-4">
              <label for="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label for="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="**********"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="mb-6">
              <label for="username" className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Name"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div>
              <button
                className="bg-blue-500 p-2 rounded text-white"
                type="button"
                onClick={(e) => {
                  handleSubmit(e);
                }}>
                SignUp
              </button>
              <div className="flex items-center gap-2">
                <p className="font-mono">existing user?</p>
                <Link to="/signin" className="bg-blue-500 rounded p-2 text-white">
                  login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

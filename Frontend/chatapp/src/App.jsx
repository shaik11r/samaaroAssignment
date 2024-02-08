import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./components/Signin";
import SignUp from "./components/SignUp";
import DashBoard from "./components/DashBoard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/dashboard" element={<DashBoard />}></Route>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="*" element={<Navigate to="signin" />} />
      </Routes>
    </>
  );
}

export default App;

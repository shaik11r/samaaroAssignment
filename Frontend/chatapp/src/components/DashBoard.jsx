import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Providers/UserContext";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [user, setUser] = useState("");
  const [sockett, setSockett] = useState(null);
  const [data, setData] = useState([]);
  const { token } = useContext(userContext);
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/userProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
      });
      const userData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/signin");
          return;
        }
      }
      setUser(userData.userDetails);
      console.log(userData.userDetails);
      establishSocketConnection(userData.userDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const establishSocketConnection = (user) => {
    if (!user || !user._id) {
      console.error("User details not available");
      return;
    }
    const socket = io("http://localhost:5000", {
      auth: {
        token: user._id,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("userStatus", { userId: user._id, status: "online" });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      socket.emit("userStatus", { userId: user._id, status: "offline" });
    });
    setSockett(socket);
  };

  const getAlluserDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/allusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/signin");
          return;
        }
      }
      console.log(responseData);
      setData(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKickUser = async (userId) => {
    try {
      const response = await fetch("http://localhost:5000/api/kickuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
        body: JSON.stringify({ userId }),
      });
      const responseData = await response.json();
      console.log(responseData);
      getAlluserDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const blockUser = async (userId) => {
    try {
      const response = await fetch("http://localhost:5000/api/blockuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
        body: JSON.stringify({ userId }),
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    getAlluserDetails();
  }, []); // Fetch user details and all users only once on component mount

  useEffect(() => {
    return () => {
      if (sockett) {
        sockett.disconnect();
        console.log("socket disconnted");
      }
    };
  }, [sockett]);
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="text-white text-3xl ">DashBoard</div>
      <div className="text-white ">
        <div className="mb-5">
          <p>hi there your are logged in as </p>
          <p className="bg-green-500 w-fit rounded p-2 font-semibold">{user?.username}</p>
        </div>
        {data?.map((ele) => (
          <div key={ele.userId} className="flex border-none w-50 justify-between m-2">
            <p className="font-semibold p-2 w-20">{ele.username}</p>
            {user.isAdmin && (
              <>
                <button
                  className="bg-blue-400 w-fit rounded p-2 font-mono"
                  onClick={() => {
                    handleKickUser(ele.userId);
                  }}>
                  kick
                </button>
                <button
                  className="bg-yellow-500 w-fit rounded p-2 font-mono "
                  onClick={() => {
                    blockUser(ele.userId);
                  }}>
                  block
                </button>
              </>
            )}
            <p
              className={`${
                ele.onlineStatus === "online"
                  ? "bg-green-600 rounded w-fit p-2 font-mono px-3"
                  : "bg-red-600 rounded w-fit p-2 font-mono"
              }`}>
              {ele.onlineStatus}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;

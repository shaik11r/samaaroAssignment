import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Providers/UserContext";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState([]);
  const { token } = useContext(userContext);
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const URL = "https://chatbackendapi.onrender.com"; BACKEND DEPLOYEMENT LINK IT IS WORKING
  const URL = "http://localhost:5000";

 
  useEffect(() => {
    getUserDetails();
    getAlluserDetails();
  }, []); // Fetch user details and all users only once on component mount
  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    establishSocketConnection(user);
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

    const establishSocketConnection = (user) => {
    const newsocket = io(`${URL}`, {
      auth: {
        token: user._id,
      },
    });
    newsocket.emit("online", user._id);
    newsocket.on("updateOnlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
    setSocket(newsocket);
  };
  
  const getAlluserDetails = async () => {
    try {
      const response = await fetch(`${URL}/api/allusers`, {
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
      setData(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKickUser = async (userId) => {
    try {
      const response = await fetch(`${URL}/api/kickuser`, {
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
      const response = await fetch(`${URL}/api/blockuser`, {
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

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${URL}/api/userProfile`, {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="text-white text-3xl ">DashBoard</div>
      <div className="text-white ">
        <div className="mb-5">
          <p>hi there your are logged in as </p>
          <p className="bg-green-500 w-fit rounded p-2 font-semibold">{user?.username}</p>
        </div>
        {data?.map((ele) => (
          <div key={ele.userId} className={`flex border-none w-50 justify-between m-2 `}>
            <p
              className={`font-semibold p-2 max-w-12 ${
                ele.isBlocked == true ? "bg-gray-300 rounded w-fit font-mono" : ""
              }`}>
              {ele.username}
            </p>
            {user.isAdmin && (
              <>
                <button
                  className="bg-blue-400 w-fit rounded p-2 font-mono"
                  disabled={ele.isBlocked}
                  onClick={() => {
                    handleKickUser(ele.userId);
                  }}>
                  kick
                </button>
                <button
                  className={`bg-yellow-500 w-fit rounded p-2 font-mono `}
                  disabled={ele.isBlocked}
                  onClick={() => {
                    blockUser(ele.userId);
                  }}>
                  block
                </button>
              </>
            )}
            <p
              className={`${
                onlineUsers.includes(ele.userId)
                  ? "bg-green-600 rounded w-fit p-2 font-mono px-3"
                  : "bg-red-600 rounded w-fit p-2 font-mono"
              }`}>
              {onlineUsers.includes(ele.userId) ? "online" : "offline"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;

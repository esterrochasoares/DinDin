import profilePicture from "../assets/profile-picture.svg";
import logoutIcon from "../assets/logout.svg";
import "../css/userInfo.css";
import axios from "axios";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router";

function UserInfo({ modal }, ref) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  async function getUser() {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8000/usuario", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  }

  useImperativeHandle(ref, () => ({
    getUser,
  }));

  useEffect(() => {
    getUser();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/");
  }

  return (
    <div class="userInfo">
      <img src={profilePicture} alt="" onClick={modal} />
      <div style={{ paddingRight: "10px" }}>{user.nome}</div>
      <img src={logoutIcon} alt="" onClick={logout}></img>
    </div>
  );
}

export default forwardRef(UserInfo);

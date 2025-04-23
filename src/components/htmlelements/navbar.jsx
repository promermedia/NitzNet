import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ navItems, userInfo, setLogged }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (!confirm("האם אתה בטוח שאתה רוצה להתנתק?")) return;
    localStorage.removeItem("NHuser");
    setLogged(false);
    navigate("/auth/login");
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <div>
          <div className="right logo-container">
            <img src="/nh.png" alt="" width={75} />
          </div>
          <p title="להתנתק" className="right log-out-trigger" onClick={handleLogout}>
            {userInfo.fName + " " + userInfo.lName}
          </p>
        </div>

        <ul className="left">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={`/${item.path}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

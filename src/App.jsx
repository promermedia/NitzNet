import { useState, useEffect } from "react";
import Login from "./components/auth/login";
import AdminDash from "./components/admin/admindash";
import ClientDash from "./components/member/clientdash";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Tools from "./components/handlers/tools";
import ForgotPassword from "./components/auth/forgotpassword";
import ResetPassword from "./components/auth/resetpassword";

function App() {
  const [isLogged, setLogged] = useState(false);
  const [initialLoginAttempt, setInitialLoginAttempt] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [onInit, setOnInit] = useState(true);

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const tokenLogin = async () => {
      setInitialLoginAttempt(true);
      try {
        const UserFromLSJSON = localStorage.NHuser;
        if (!UserFromLSJSON) throw new Error("no user in LS");
        const UserFromLS = JSON.parse(UserFromLSJSON);
        const Token = UserFromLS.token;
        if (Token) {
          var formdata = new FormData();
          formdata.append("token", Token);
          var requestOptions = {
            method: "POST",
            body: formdata,
          };

          const response = await fetch(
            Tools.serverURL + "auth/tokenLogin",
            requestOptions
          );
          const result = await response.json();
          if (result && result.payload && result.payload.success === true) {
            // if (true) {
            // REMOVE
            Tools.updateLS("NHuser", "token", result.payload.user.token);
            setUser(result.payload.user);
            // setUser(UserFromLS); // REMOVE
            //setIsAdmin(true); // REMOVE

            if (result.payload.user.role == 1 || result.payload.user.role == 2)
              setIsAdmin(true);
            setLogged(true);
            setOnInit(false)
          } else throw new Error("Wrong token");
        } else throw new Error("No token");
      } catch (error) {
        setOnInit(false)
        const hash = window.location.hash;
        if (hash.includes("reset-password")) {
          const token = hash.split("?t=")[1];
          if (token) {
            setResetToken(token);
            setResetPassword(true);
          }
        }
        console.log(error);
      }
    };

    if (!initialLoginAttempt) {
      tokenLogin();
    }
  }, [initialLoginAttempt]);

  return (
    <>
      {onInit ? (
        <div id="on-init">
          <h1>רגע אחת בבקשה...</h1>
        </div>
      ) : (
        ""
      )}
      {!isLogged ? (
        <div className={"login-form "}>
          <div className="center">
            <img src="/nh_bk.png" alt="" width={150} />
          </div>
          <h3 className="center">ברוכים הבאים לניצנט</h3>
          <Router>
            {resetPassword && resetToken ? (
              <Navigate to={`/auth/reset-password?t=${resetToken}`} />
            ) : null}
            <Routes>
              <Route
                path={`/auth/login`}
                element={
                  <Login
                    setLogged={setLogged}
                    setUser={setUser}
                    setIsAdmin={setIsAdmin}
                  />
                }
              />
              <Route
                path={`/auth/forgot-password`}
                element={<ForgotPassword />}
              />
              <Route
                path={`/auth/reset-password`}
                element={<ResetPassword setResetPassword={setResetPassword} />}
              />
              <Route
                path="/"
                element={
                  <Login
                    setLogged={setLogged}
                    setUser={setUser}
                    setIsAdmin={setIsAdmin}
                  />
                }
              />
            </Routes>
            <div className="flex-center">
              {" "}
              <Link
                to={isLoginMode ? "/auth/forgot-password" : "/auth/login"}
                onClick={toggleMode}
              >
                {isLoginMode ? "שכחתם סיסמה" : "חזרה להתחברות"}
              </Link>
            </div>
          </Router>
        </div>
      ) : isAdmin ? (
        <div className={"admin-dashboard"}>
          <AdminDash userInfo={user} setLogged={setLogged}></AdminDash>
        </div>
      ) : (
        <div className={"client-dashboard"}>
          <ClientDash userInfo={user} setLogged={setLogged}></ClientDash>
        </div>
      )}
    </>
  );
}

export default App;

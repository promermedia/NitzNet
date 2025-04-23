import React, { useState } from "react";
import Input from "../htmlelements/input";
import Button from "../htmlelements/button";
import Tools from "../handlers/tools";
import M from "materialize-css";

function Login({ setLogged, setUser, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function login() {
    try {
      setIsLoggingIn(true);
      var formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password);

      var requestOptions = {
        method: "POST",
        body: formdata,
      };
      M.toast({
        html: "מתחברים...רק רגע",
        classes: "rounded teal lighten-2",
        displayLength: 2000,
      });
      const response = await fetch(
        Tools.serverURL + "auth/login",
        requestOptions
      );
      const result = await response.json();

      if (result && result.payload && result.payload.success === true) {
        localStorage.NHuser = JSON.stringify(result.payload.user);
        setLogged(true);
        // setOnInit(false);
        setUser(result.payload.user);
        if (result.payload.user.role == 1 || result.payload.user.role == 2)
          setIsAdmin(true);
      } else {
        setErrorMessage("אחד או יותר מהשדות שלך שגויים");
        setIsLoggingIn(false);
        throw new Error("Wrong crededntials");
      }
    } catch (error) {}
  }

  return (
    <div className="form">
      <div className="row">
        <div className="col l4 m3 s12"></div>
        <div className="col l4 m6 s12">
          <h4 className="center">התחברות</h4>
          <Input
            id={"login-email"}
            isRequired={true}
            type={"text"}
            value={email}
            placeholder={"מייל"}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          ></Input>
          <Input
            id={"login-password"}
            isRequired={true}
            type={"password"}
            value={password}
            placeholder={"סיסמה"}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <div className={"error-div " + (errorMessage == "" ? "hidden" : "")}>
            <p className="red-text text-darken-2">{errorMessage}</p>
          </div>
          <div>
            <Button
              onClick={login}
              innerText={"להתחבר"}
              className={"full-width blue"}
              disabled={isLoggingIn}
            ></Button>
          </div>
        </div>
        <div className="col l4 m3 s12"></div>
      </div>{" "}
    </div>
  );
}

export default Login;

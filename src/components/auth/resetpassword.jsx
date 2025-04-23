import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../htmlelements/input";
import Button from "../htmlelements/button";
import Tools from "../handlers/tools";
import M from "materialize-css";


function ResetPassword({ setResetPassword }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("t");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [renewedSuccess, setRenewedSuccess] = useState(false);
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (token) setIsToken(true);
  }, [token]);

  async function renew(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (password !== confirmPassword)
        return setErrorMessage("שתי הסיסמאות אינן תואמות");
      if (!Tools.passwordStrength(password))
        return setErrorMessage(`עוצמת הסיסמה אינה מספקת.
אורך סיסמה: 8-20 תווים.
לפחות אות אחת גדולה.
מינימום ספרה אחת.
לפחות תו מיוחד אחד`);
      M.toast({
        html: "מתחברים...רק רגע",
        classes: "rounded teal lighten-2",
        displayLength: 2000,
      });
      var formdata = new FormData();
      formdata.append("password", password);
      formdata.append("token", token);

      var requestOptions = {
        method: "POST",
        body: formdata,
      };

      const response = await fetch(
        Tools.serverURL + "auth/newPassword",
        requestOptions
      );
      const result = await response.json();

      if (result && result.payload && result.payload.success === true) {
        setRenewedSuccess(true);
        setTimeout(() => {
          console.log("rerouting to login");
          setResetPassword(false);
          navigate("/auth/login");
        }, 2000);
      } else {
        setErrorMessage(
          "אנא בקש קישור חדש מכיוון שהקישור שבו השתמשתם אינו פועל יותר"
        );
        throw new Error(result.payload);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return isToken ? (
    <div className="form">
      <div className="row">
        <div className="col l4 m3 s12"></div>
        <div className="col l4 m6 s12">
          <h4 className="center">חידוש סיסמה</h4>
          <form onSubmit={renew}>
            <Input
              id={"renew-password"}
              isRequired={true}
              type={"password"}
              value={password}
              placeholder={"סיסמה חדשה"}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Input
              id={"renew-password-confirm"}
              isRequired={true}
              type={"password"}
              value={confirmPassword}
              placeholder={"אימות סיסמה"}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Input>
            <div
              className={"error-div " + (errorMessage == "" ? "hidden" : "")}
            >
              <p className="red-text text-darken-2">{errorMessage}</p>
            </div>
            <div>
              <Button
                type={"submit"}
                innerText={"לשחזר"}
                className={"full-width blue"}
              ></Button>
            </div>{" "}
          </form>
          <div
            className={
              "success-div " + (renewedSuccess == false ? "hidden" : "")
            }
          >
            <p className="blue-text text-darken-2">
              הסיסמה שלכם עודכנה בהצלחה
              <br />
              כעת תוכלו להמשיך לכניסה
            </p>
          </div>
        </div>
        <div className="col l4 m3 s12"></div>
      </div>{" "}
    </div>
  ) : (
    <h4 className="center">
      קישור זה אינו תקף <br /> אנא בקשו אחד חדש
    </h4>
  );
}

export default ResetPassword;

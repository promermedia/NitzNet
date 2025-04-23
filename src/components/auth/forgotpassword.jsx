import React, { useState } from "react";
import Input from "../htmlelements/input";
import Button from "../htmlelements/button";
import Tools from "../handlers/tools";

function ForgotPassword({}) {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sentEmail, setSentEmail] = useState(false);

  async function forgot(e) {
    setErrorMessage("");
     e.preventDefault();
    try {
      const fixedEmail = Tools.processEmail(username)
      if (!fixedEmail) return setErrorMessage("כתובת מייל הזו לא חוקית");
      var formdata = new FormData();
      formdata.append("email", fixedEmail);

      var requestOptions = {
        method: "POST",
        body: formdata,
      };

      const response = await fetch(
        Tools.serverURL + "auth/resetPassword",
        requestOptions
      );
      const result = await response.json();

      if (result && result.payload && result.payload.success === true) {
        setSentEmail(true);
      } else {
        setErrorMessage("האימייל שסופקו לא נמצא");
        throw new Error("Wrong email");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="form">
      <div className="row">
        <div className="col l4 m3 s12"></div>
        <div className="col l4 m6 s12">
          <h4 className="center">שחזור סיסמה</h4>
          <form onSubmit={forgot}>
            <Input
              id={"forgot-email"}
              isRequired={true}
              type={"text"}
              value={username}
              placeholder={"אנא הכנס את כתובת מייל שלכם"}
              onChange={(e) => setUsername(e.target.value)}
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
            className={"success-div " + (sentEmail == false ? "hidden" : "")}
          >
            <p className="blue-text text-darken-2">
              נשלח אליכם מייל עם הנחיות נוספות
            </p>
          </div>
        </div>
        <div className="col l4 m3 s12"></div>
      </div>{" "}
    </div>
  );
}

export default ForgotPassword;

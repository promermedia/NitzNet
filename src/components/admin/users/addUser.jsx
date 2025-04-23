import React, { useState, useEffect } from "react";
import Input from "../../htmlelements/input";
import Button from "../../htmlelements/button";
import Select from "../../htmlelements/select";
import Tools from "../../handlers/tools";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../../handlers/redux/actions/usersActions";
import M from "materialize-css";

function AddUser({}) {
  const [f_name, setFname] = useState("");
  const [l_name, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [goodEmail, setGoodEmail] = useState("");
  const [cell, setCellPhone] = useState("");
  const [role, setRole] = useState("");
  const [is_operator, setIsOperator] = useState("");
  const [is_operator_aid, setIsOperatorAid] = useState("");

  var roles = useSelector((state) => state.roles);
  const [allRolesOpts, setAllRoles] = useState([]);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const updateRolesOptions = () => {
      setAllRoles(
        roles.map((x) => ({
          value: x.id,
          text: `${x.role}`,
        }))
      );
    };
    updateRolesOptions();

    setTimeout(() => {
      M.updateTextFields();
    }, 1000);
  }, [roles]);

  function setPreEmail(target) {
    const PreEmail = email;
    if (PreEmail === goodEmail) return;
    const fixedEmail = Tools.processEmail(PreEmail);
    if (!fixedEmail) {
      target.classList.remove("valid");
      target.classList.add("invalid");

      setEmailErrorMessage("מייל זה לא חוקי");
    } else {
      fetch(`${Tools.serverURL}getters/getUserByUserName?email=${fixedEmail}`)
        .then((response) => response.json())
        .then((result) => {
          if (result.Table && result.Table.length > 0) {
            setEmailErrorMessage("מייל זה כבר קיים במערכת");
            target.classList.remove("valid");
            target.classList.add("invalid");
          } else {
            setEmailErrorMessage("");
            target.classList.remove("invalid");
            target.classList.add("valid");
            setGoodEmail(fixedEmail);
          }
        })
        .catch((error) => console.log("error", error));
    }
  }

  async function addNewUser(e) {
    e.preventDefault();
    try {
      if (emailErrorMessage) {
        setErrorMessage(emailErrorMessage);
        throw new Error(emailErrorMessage);
      }
      var formdata = new FormData();
      formdata.append("token", Tools.getLSbyKey("NHuser", "token"));
      formdata.append("f_name", f_name);
      formdata.append("l_name", l_name);
      formdata.append("email", goodEmail);
      formdata.append("cell", cell);
      formdata.append("role", role);
      formdata.append("is_operator", is_operator);
      formdata.append("is_operator_aid", is_operator_aid);

      var requestOptions = {
        method: "POST",
        body: formdata,
      };
      M.toast({
        html: "מוסיפים משתמש",
        classes: "rounded teal lighten-2",
        displayLength: 2000,
      });
      const response = await fetch(
        Tools.serverURL + "auth/addUser",
        requestOptions
      );
      const result = await response.json();

      if (result && result.payload && result.payload.success === true) {
        dispatch(addUser(result.payload.newUser));
        const elem = document.querySelector(".modal");
        const Inst = M.Modal.getInstance(elem);
        Inst.close();
      } else {
        setErrorMessage("אחד או יותר מהשדות שלכם שגויים");
        setIsLoggingIn(false);
        throw new Error(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="modal" id={"add-user-modal"}>
      <form onSubmit={addNewUser}>
        <div className="modal-content">
          <h3 className="center">הוספת משתמש</h3>

          <Input
            id={"add-user-f-name"}
            isRequired={true}
            type={"text"}
            value={f_name}
            onChange={(e) => setFname(e.target.value)}
            placeholder={"שם פרטי"}
          ></Input>
          <Input
            id={"add-user-l-name"}
            isRequired={true}
            type={"text"}
            value={l_name}
            onChange={(e) => setLname(e.target.value)}
            placeholder={"שם משפחה"}
          ></Input>
          <Input
            id={"add-user-email"}
            isRequired={true}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => setPreEmail(e.target)}
            placeholder={"מייל"}
            errorMessage={emailErrorMessage}
          ></Input>
          <Input
            id={"add-user-cell"}
            isRequired={true}
            type={"text"}
            value={cell}
            onChange={(e) => setCellPhone(e.target.value)}
            placeholder={"סלולר"}
          ></Input>
          <Select
            id={"add-user-role"}
            isRequired={true}
            onChange={(e) => setRole(e.target.value)}
            placeholder={"תפקיד"}
            options={allRolesOpts}
          ></Select>
        </div>
        <div className={"error-div " + (errorMessage == "" ? "hidden" : "")}>
          <p className="red-text text-darken-2">{errorMessage}</p>
        </div>
        <div>
          <Button
            type={"submit"}
            innerText={"הוסף משתמש"}
            className={"full-width blue"}
          ></Button>
        </div>
      </form>
      {""}
    </div>
  );
}

export default AddUser;

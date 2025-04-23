import React, { useState, useEffect, useRef } from "react";
import Input from "../htmlelements/input";
import Select from "../htmlelements/select";
import Button from "../htmlelements/button";
import Tools from "../handlers/tools";
import { useSelector, useDispatch } from "react-redux";
// import { addPayment } from "../handlers/redux/actions/paymentActions";
import M from "materialize-css";
import Funcs from "../handlers/funcs";

function AddDonation({}) {
  const [user_id, setUserID] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [payment_type_id, setPaymentTypeID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState(Date.now());
  const dispatch = useDispatch();
  const [allUsersOpts, setAllUsersOpts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(
    Tools.getLSbyKey("NHuser", "role") == 1 ? true : false
  );

  var users = useSelector((state) => state.users);
  const PaymentTypes = [
    { value: 1, text: "מזומן" },
    { value: 2, text: "שיק" },
    { value: 3, text: "העברה בנקאית" },
    { value: 4, text: "אשראי" },
  ];

  useEffect(() => {
    if (isAdmin) {
      const updateOptions = () => {
        setAllUsersOpts(
          users.map((x) => ({
            value: x.id,
            text: `${x.f_name} ${x.l_name}`,
          }))
        );
      };

      updateOptions();
    } else {
      setUserID(Tools.getLSbyKey("NHuser", "id"));
    }
  }, [users]);

  async function addNewPayment(e) {
    e.preventDefault();
    try {
      var formdata = new FormData();
      formdata.append("token", Tools.getLSbyKey("NHuser", "token"));
      formdata.append("user_id", user_id);
      formdata.append("date", date);
      formdata.append("amount", amount);
      formdata.append("note", note);
      formdata.append("payment_type_id", payment_type_id);
      formdata.append("payment_for_id", 1);
      M.toast({
        html: "מוסיפים תשלום",
        classes: "rounded teal lighten-2",
        displayLength: 2000,
      });
      const newDon = await Funcs.addDonation(formdata);

      if (newDon) {
        newDon.formattedDate = Tools.formatDate(newDon.date);
        dispatch(addPayment(newDon));
        const elem = document.querySelector(".modal");
        const Inst = M.Modal.getInstance(elem);
        Inst.close();
      } else {
        setErrorMessage("אחד או יותר מהשדות שלך שגויים");
        throw new Error(newDon);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="modal" id={"add-payment-modal"}>
      <form onSubmit={addNewPayment}>
        <div className="modal-content">
          <h3 className="center">הוספת תשלום</h3>
          {isAdmin ? (
            <Select
              id={"add-payment-user-id"}
              isRequired={true}
              onChange={(e) => setUserID(e.target.value)}
              placeholder={"שם משתמש"}
              options={allUsersOpts}
            ></Select>
          ) : (
            ""
          )}

          <Select
            id={"add-payment-payment-type-id"}
            isRequired={true}
            onChange={(e) => setPaymentTypeID(e.target.value)}
            placeholder={"סוג תשלום"}
            options={PaymentTypes}
          ></Select>
          <Input
            id={"add-payment-amount"}
            isRequired={true}
            type={"text"}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={"סכום"}
          ></Input>
          <Input
            id={"add-payment-note"}
            isRequired={true}
            type={"text"}
            onChange={(e) => setNote(e.target.value)}
            placeholder={"הערות"}
          ></Input>
          <Input
            id={"add-payment-date"}
            isRequired={true}
            type={"text"}
            className={"datepicker"}
            onChange={(e) => setDate(new Date(e.target.value).getTime())}
            placeholder={"תאריך תשלום"}
          ></Input>
        </div>
        <div className={"error-div " + (errorMessage == "" ? "hidden" : "")}>
          <p className="red-text text-darken-2">{errorMessage}</p>
        </div>
        <div>
          <Button
            type={"submit"}
            innerText={"הוסף תשלום"}
            className={"full-width blue"}
          ></Button>
        </div>
      </form>
      {""}
    </div>
  );
}

export default AddDonation;

// 054-847-5006 israeli
//  052-717-5678 ibn

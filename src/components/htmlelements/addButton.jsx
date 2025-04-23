import React from "react";
import Button from "./button";

function AddButton({ datatarget }) {
  return (
    <div className="fixed-action-btn">
      <Button
        dataTarget={datatarget}
        innerText={
          <i className="pi pi-plus" style={{ fontSize: "1.3rem" }}></i>
        }
        className={
          "btn-floating btn-large waves-effect waves-light red modal-trigger"
        }
      ></Button>
    </div>
  );
}

export default AddButton;
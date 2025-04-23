import React from "react";
import "./style.css";

function Button({ onClick, innerText, className, dataTarget, type }) {
  return (
    <button
      type={type}
      data-target={dataTarget}
      className={"btn waves-effect waves-light " + className}
      onClick={onClick}
    >
      {innerText}
    </button>
  );
}

export default Button;

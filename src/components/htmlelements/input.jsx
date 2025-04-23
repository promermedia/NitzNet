import React, { useEffect } from "react";
import "./style.css";
import M from "materialize-css";

function Input({
  className,
  type,
  isRequired,
  onInput,
  onChange,
  id,
  onBlur,
  value,
  placeholder,
  errorMessage,
}) {
  useEffect(() => {
    if (className && className.includes("datepicker")) {
      var elems = document.querySelectorAll(".datepicker");
      M.Datepicker.init(elems, {
        autoClose: true,
        defaultDate: new Date(),
        setDefaultDate: true,
        isRTL:true
      });
    }
  }, [className]);

  return (
    <div className="input-field">
      <input
        value={value}
        id={id}
        className={className}
        type={type}
        required={isRequired}
        onInput={onInput}
        onChange={onChange}
        onBlur={onBlur}
      />
      <label htmlFor={id}>{placeholder}</label>
      {errorMessage && (
        <span
          className="helper-text"
          data-error={errorMessage}
          data-success=""
        ></span>
      )}
    </div>
  );
}

export default Input;

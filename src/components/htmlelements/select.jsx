import React, { useEffect } from "react";
import "./style.css";
import M from "materialize-css";

function Select({
  className,
  isRequired,
  onChange,
  id,
  value,
  placeholder,
  errorMessage,
  options,
}) {
  useEffect(() => {
    const elems = document.querySelectorAll("select");
    M.FormSelect.init(elems);
  }, [options]);

  return (
    <div className="input-field">
      <select
        value={value}
        id={id}
        className={className}
        required={isRequired}
        onChange={onChange}
      >
        <option key="default" value="">
          לבחור
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <label>{placeholder}</label>
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

export default Select;

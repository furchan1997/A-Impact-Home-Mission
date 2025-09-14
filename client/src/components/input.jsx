function Input({ label, inputType, isCheckBoxInput, ...rest }) {
  return (
    <div className="mb-3">
      {!isCheckBoxInput ? (
        <>
          <label htmlFor={rest.name} className="form-label">
            {label}
            {rest.required && <span className="text-danger ms-1">*</span>}
          </label>
          <input
            type={inputType}
            {...rest}
            className={["form-control", rest.error && "is-invalid"]
              .filter(Boolean)
              .join(" ")}
            id={rest.id}
            name={rest.name}
          />
        </>
      ) : (
        <>
          <lable className="form-check-label" htmlFor={rest.name}>
            {label}
          </lable>
          <input
            className="form-check-input 
              form-check-lg border 
              border-2 
              border-dark 
              mx-1"
            type="checkbox"
            id={rest.id}
            name={rest.name}
            {...rest}
          />
        </>
      )}
      {rest.error && (
        <div className="invalid-feedback d-block">{rest.error}</div>
      )}
    </div>
  );
}

export default Input;

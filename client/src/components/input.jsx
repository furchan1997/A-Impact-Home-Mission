function Input({ lable, inputType, isCheckBoxInput, ...rest }) {
  return (
    <div className="mb-3">
      {!isCheckBoxInput ? (
        <>
          <label htmlFor={rest.name} className="form-label">
            {lable}
          </label>
          <input
            type={inputType}
            {...rest}
            className="form-control"
            id={rest.id}
          />
        </>
      ) : (
        <>
          <lable className="form-check-label">{lable}</lable>
          <input
            className="form-check-input form-check-lg border border-2 border-dark mx-1"
            type="checkbox"
            id={rest.id}
          />
        </>
      )}
    </div>
  );
}

export default Input;

// רכיב שדה קלט מותאם אישית אשר יטפל לנו בשדות הטופס
// למיקרה הצורך יהיה קלט מסוג צ'קבוקס
function Input({ lable, inputType, isCheckBoxInput, ...rest }) {
  return (
    <div className="mb-3">
      {!isCheckBoxInput ? ( // אם זה לא צ'קבוקס נציג שדה קלט רגיל
        <>
          <label htmlFor={rest.name} className="form-label">
            {lable}
            {/* אם זהו שדה חובה יוצג כוכבית בצבע אדום למען חווית משתמש נוחה */}
            {rest.required && <span className="text-danger ms-1">*</span>}{" "}
          </label>
          <input
            type={inputType} // סוג הקלט (NUMBER/TEXT)
            {...rest} // מפזר את כל שאר הפרופס אם זה- (VALUE, ON CHANCH וכו')
            className={["form-control", rest.error && "is-invalid"]
              .filter(Boolean)
              .join(" ")} // הוספת מחלקה מתאימה במידה ונמצא שגיאה
            id={rest.id}
            name={rest.name}
          />
        </>
      ) : (
        <>
          <lable className="form-check-label" htmlFor={rest.name}>
            {lable}
          </lable>
          <input
            className="form-check-input 
              form-check-lg border 
              border-2 
              border-dark 
              mx-1"
            type="checkbox" // עבור צ'קבוקס
            id={rest.id}
            name={rest.name}
            {...rest} // אחראי לפיזור שאר הפרופס
          />
        </>
      )}
      {rest.error && (
        <div className="invalid-feedback d-block">{rest.error}</div> // אם יש שגיאה מציג אותה מתחת לשדה
      )}
    </div>
  );
}

export default Input; // ייצוא של הרכיב בכדי להשתמש בו בטפסים אחרים

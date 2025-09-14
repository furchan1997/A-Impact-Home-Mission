// רכיב אשר יטפל בקבלת פני המשתמשים , יוצג עבור שני המינים, יסביר ויתן הנחיות עבור האפליקציה
function Summary() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center bg-light p-4">
      <div className="card shadow-lg p-4 border-0">
        <h1 className="mb-3 text-primary fw-bold">
          🏛️ שאלון רישוי עסקים – בדיקה רגולטורית
        </h1>

        <p className="lead mb-4">
          ברוך/ה הבא/ה! כאן אפשר לבדוק בקלות אם העסק שלך עומד בדרישות החוק
          והתקנות.
          <br />
          מלא/י מספר שאלות קצרות, ותקבל/י דו״ח מותאם אישית מסוכן ה-AI שלנו: האם
          העסק שלך עומד בתקנים, אילו סעיפים מתקיימים, ומה ניתן לשפר.
        </p>

        <p className="fw-semibold">מוכן/ה להתחיל? 😃</p>
      </div>
    </div>
  );
}

export default Summary; // ייצוא של הרכיב בלבד

import ReactMarkdown from "react-markdown";

// רכיב יעודיי עבור דו''ח ה-AI שמתקבל מהשרת
export default function ReportCard({
  loading,
  error,
  aiReport, // הדו''ח מהשרת
  matchedRules = [], // מערך החוקים שנטענו מהקובץ המעובד (JSON שנבנה מה-PDF).
  // יוצג למשתמש כ-FALLBACK במקרה שאין דו"ח מה-AI.
}) {
  if (loading) {
    return <div className="alert alert-info my-3">מייצר דוח…</div>; // מצב טעינה שיוצג למשתמש
  }

  if (error) {
    return <div className="alert alert-danger my-3">שגיאה: {error}</div>; // מצב שגיאה עם עיצוב מותאם והודעה שצפויה להתקבל מהשרת
  }

  if (!aiReport && !matchedRules.length) {
    return null; // אם אין דו''ח ואין חוקים מתאימים אז לא מציגים כלום
  }

  const createdAt = new Date().toLocaleTimeString("he-IL"); // יצירת זמן לוקאלי לשעון ישראל, יוצג בתחתית הכרטיס

  return (
    <div className="card mt-3 w-100">
      <div className="card-body">
        {aiReport && ( // אם קיים הדו''ח מה-AI אז מציגים אותו
          <>
            <h4>דו''ח AI</h4>
            {/* מארקדאון מאפשר רינדור במקום טקסט רגיל */}
            <ReactMarkdown>{aiReport}</ReactMarkdown>{" "}
          </>
        )}
        {!aiReport &&
          matchedRules.length > 0 && ( // אם אין דו''ח אבל יש חוקים מתאימים אז מציגים רשימת חוקים שבתוך מערך matchedRules עם המפתח requirement
            <>
              <h4>דרישות מתאימות</h4>
              <ul className="list-group">
                {matchedRules.map((rule) => (
                  <li key={rule?.id}>{rule?.requirement}</li> // מפוי המערך למערך שמכיל את הדרישות בלבד לצד מזהה יחודיי אשר ישמש ליצבות
                ))}
              </ul>
            </>
          )}
        {/* חותמת זמן ליצירת שקיפות עבור המשתמשים */}
        <p className="text-muted small mt-3">נוצר בתאריך: {createdAt}</p>{" "}
      </div>
    </div>
  );
}

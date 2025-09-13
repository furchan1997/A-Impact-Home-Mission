import ReactMarkdown from "react-markdown";

export default function ReportCard({
  loading,
  error,
  aiReport,
  matchedRules = [],
}) {
  if (loading) {
    return <div className="alert alert-info my-3">מייצר דוח…</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">שגיאה: {error}</div>;
  }

  if (!aiReport && !matchedRules.length) {
    return null; // אין מה להציג
  }

  const createdAt = new Date().toLocaleTimeString("he-IL");

  return (
    <div className="card mt-3 w-100">
      <div className="card-body">
        {aiReport && (
          <>
            <h4>דו''ח AI</h4>
            <ReactMarkdown>{aiReport}</ReactMarkdown>
          </>
        )}
        {!aiReport && matchedRules.length > 0 && (
          <>
            <h4>דרישות מתאימות</h4>
            <ul className="list-group">
              {matchedRules.map((rule) => (
                <li key={rule?.id}>{rule?.requirement}</li>
              ))}
            </ul>
          </>
        )}
        <p className="text-muted small mt-3">נוצר בתאריך: {createdAt}</p>{" "}
      </div>
    </div>
  );
}

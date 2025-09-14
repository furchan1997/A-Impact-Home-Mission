import { GoogleGenerativeAI } from "@google/generative-ai";

export async function buildReport({ inputs, matchedRules }) {
  // הכנת טקסט חוקים להצדה בדו''ח כולל FALLBACK במיקרה ובו אין התאמות
  const rulesText =
    matchedRules.length > 0
      ? matchedRules.map((r) => `- ${r.requirement}`).join("\n")
      : "אין חוקים מותאמים.";
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ייבוא של מפתח סודי ממשתנה סביבה
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", //  אתחול מודל GEMINI לצורך יצירת הדוח
    });

    // בניית פרומפט: נתוני העסק + חוקים רלוונטיים + הנחיות ל-LLM להחזרת דוח תמציתי וברור
    const prompt = `
      אתה יועץ רגולטורי לעסקים
      נתוני העסק:
      (שים לב: bizSize מייצג את גודל העסק במ"ר, ולא מספר עובדים)
      ${JSON.stringify(inputs)}
      
      ## חוקים שהתאימו
      ${rulesText}
  
        החזר דוח קצר וברור בעברית:
        -  הדו"ח יותאם למאפיינים הספציפיים של העסק
        - המודל יתרגם "שפת חוק" לשפה עסקית מובנת
        - חלוקה לקטגוריות עם עדיפויות והמלצות פעולה
     
    `.trim();

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    // טיפול בשגיאה מצד ה-API של GEMINI
    console.error("Error generating AI report:", err.message);
    return `
     לא ניתן היה ליצור דו"ח אוטומטי כרגע.
      נתוני העסק התקבלו בהצלחה, והחוקים שזוהו הם:
      ${rulesText}
    `;
  }
}

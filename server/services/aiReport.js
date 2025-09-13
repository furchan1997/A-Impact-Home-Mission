import { GoogleGenerativeAI } from "@google/generative-ai";

export async function buildReport({ inputs, matchedRules }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("GEMINI KEY: ", process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const rulesText =
    matchedRules.length > 0
      ? matchedRules.map((r) => `- ${r.requirement}`).join("\n")
      : "אין חוקים מותאמים.";

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
}

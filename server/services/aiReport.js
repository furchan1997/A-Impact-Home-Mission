import { GoogleGenerativeAI } from "@google/generative-ai";

export async function buildReport({ inputs, matchedRules }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("GEMINI KEY: ", process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
    אתה יועץ רגולטורי לעסקים
    נתוני העסק: ${JSON.stringify(inputs)}
    חוקים שהתאימו: ${
      matchedRules.map((r) => r.requirement).join(" ") || "אין חוקים מותאמים."
    }
      החזר דוח קצר וברור בעברית:
      - המודל יקבל את הנתונים הגולמיים ויעבד אותם לדוח/תמצית ברור ומובן
      -  הדוח יותאם למאפיינים הספציפיים של העסק
      - תתרגם "שפת חוק" לשפה עסקית מובנת
      - חלק לקטגוריות עם עדיפויות והמלצות פעולה
   
  `.trim();

  const result = await model.generateContent(prompt);
  return result.response.text();
}

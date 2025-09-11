// ייבוא של התליות הרלוונטיים
import fs from "fs";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { fileURLToPath } from "url";
import { REGEX } from "./regex.js"; // ייבוא קובץ REGEX אשר יועיל בקריאתו בקוד וישמור על סדר ונקיון

// משחזר את הנתיב המוחלט לקובץ הנוכחי (ESM לא מספק __filename מובנה)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// פונקציית עזר ליצירת נתיבים (paths) אחידים
// מקבלת פרמטרים עם שמות תיקיות/קבצים ומחזירה אובייקט עם כל הנתיבים הדרושים.
// המטרה: לשמור על סדר, קריאות, ושימוש חוזר בקוד במקרים שונים.
function makePaths({
  dataName = "data",
  outDirName = "out",
  pdfFile = "regulations.pdf",
  rawTxt = "raw.txt",
  rulesJson = "rules.json",
} = {}) {
  const projectRoot = path.resolve(__dirname, "..");
  const dataDir = path.join(projectRoot, dataName);
  const outDir = path.join(projectRoot, outDirName);
  const pdfPath = path.join(dataDir, pdfFile);
  const rawPath = path.join(outDir, rawTxt);
  const rulesPath = path.join(outDir, rulesJson);

  return { projectRoot, dataDir, outDir, pdfPath, rawPath, rulesPath };
}

// פונקציה ייעודית לפענוח ועיבוד קובץ PDF.
// התהליך כולל:
// 1. המרת ה-PDF לטקסט ושמירתו כ-raw.txt (לצורכי בדיקה/בקרה).
// 2. חילוץ כללים רלוונטיים מתוך התקנון באמצעות חיפוש מילות מפתח.
// 3. המרת הכללים לפורמט JSON (rules.json) לשימוש עתידי מול שאלון הלקוח.
async function extract() {
  // קריאה לפונקציה (makePaths), ושימוש בערכי המשתנים
  const { projectRoot, dataDir, outDir, pdfPath, rawPath, rulesPath } =
    makePaths({});

  //   בדיקה ראשונית: האם קיים קובץ PDF בכלל ? אם לא נסגור את התוכנית.
  //   פירוט ותיאור השגיאה ללוג
  if (!fs.existsSync(pdfPath)) {
    console.error(" לא נמצא הקובץ:", pdfPath);
    console.error(
      "טיפ: ודא שהקובץ נקרא בדיוק 'regulations.pdf' וממוקם ב- /data"
    );
    process.exit(1);
  }

  // יצירת תיקייה חדשה עבור אחסון קבצי העיבוד (raw.txt) וקובץ החוקים (rules.json).
  // שימוש באופציה recursive מבטיח שהתיקייה תיווצר במידת הצורך ולא תיזרק שגיאה אם היא כבר קיימת.
  fs.mkdirSync(outDir, { recursive: true });

  try {
    // קריאה של קובץ ה-PDF בשיטה סינכרונית
    // בדיקה אם בכלל יש קובץ לקריאה והאם יש אורך בייתים בקובץ
    const buffer = fs.readFileSync(pdfPath);
    if (!buffer || !buffer.byteLength) {
      throw new Error("קריאת PDF החזירה Buffer ריק");
    }

    const data = await pdf(buffer); // פענוח תוכן ה-PDF בעזרת הספרייה
    const text = data.text || ""; // שליפת הטקסט הגולמי מהקובץ

    fs.writeFileSync(rawPath, text, "utf8"); // כתיבה של הטקסט הגולמי לקובץ (raw.txt) בקידוד UTF-8

    // כללי זיהוי ראשוניים למקומות ישיבה

    const rules = []; // מערך שישמש לאחסון כללי הרגולציה שיתקבלו לאחר בדיקות התנאים

    // תנאים ומגבלות לעסק עד 200 אנשים.
    if (REGEX.seatingUpTo200.test(text)) {
      rules.push({
        id: "SEATING_LTE_200",
        condition: { seating_lte: 200, alcohol: false },
        requirement:
          "עסק עד 200 מקומות ישיבה ללא מכירת/הגשת/צריכת אלכוהול פטור מדרישות מסוימות",
      });
    }

    // תנאים ומגבלות לעסק אשר מכינים בו: בשר, דגים, עופות.
    if (REGEX.hotPrep.test(text)) {
      rules.push({
        id: "FEATURE_HOT_PREP",
        condition: { features: ["meat", "fish"] },
        requirement:
          "לבשל בשר/עופות/דגים עד חימום מלא (72°C למשך 2 דקות בנקודה הקרה), לקרר במהירות אם מוגש קר, ולאחסן בטמפרטורות מתאימות",
      });
    }
    // בדיקה עבור מערכת גז לעסק
    if (REGEX.gas.test(text)) {
      rules.push({
        id: "FEATURE_GAS_LPG",
        condition: { features: ["gas"] },
        requirement:
          'מערכת גפ"מ וציוד נלווים במצב תקין ומתוחזק; לשמור בעסק אישורים (מטפים לפי ת"י 129/1, בדיקת חשמל/תאורות חירום).',
      });
    }

    // כתיבת קובץ JSON עם החוקים שעובדו מה-PDF
    // המרה של האובייקט למחרוזת בפורמט JSON ושמירתו בקידוד UTF-8
    fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2), "utf8");

    console.log("raw saved to:", rawPath);
    console.log("rules saved to:", rulesPath);
  } catch (err) {
    // תפיסת השגיאות, הצגת הודעה בלוג וסגירת התוכנית
    console.error(" Extract failed:", err);
    process.exit(1);
  }
}

// הפעלה הפונקציה אשר תיצור לנו את תקיית OUT עם הקבצים
extract();

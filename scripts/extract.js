import fs from "fs";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { features } from "process";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function extract() {
  // שורש הפרויקט (תיקייה אחת מעל scripts/)

  const { projectRoot, dataDir, outDir, pdfPath, rawPath, rulesPath } =
    makePaths({});

  // ודא שה-PDF קיים
  if (!fs.existsSync(pdfPath)) {
    console.error(" לא נמצא הקובץ:", pdfPath);
    console.error(
      "טיפ: ודא שהקובץ נקרא בדיוק 'regulations.pdf' וממוקם ב- /data"
    );
    process.exit(1);
  }

  // צור out/
  fs.mkdirSync(outDir, { recursive: true });

  try {
    const buffer = fs.readFileSync(pdfPath);
    if (!buffer || !buffer.byteLength) {
      throw new Error("קריאת PDF החזירה Buffer ריק");
    }

    const data = await pdf(buffer); // ← כאן חשוב שבאמת נמסר buffer
    const text = data.text || "";

    fs.writeFileSync(rawPath, text, "utf8");

    // כללי זיהוי ראשוניים למקומות ישיבה
    const rules = [];
    if (!/מעל\s*200\s*מקומות\s*ישיבה/.test(text)) {
      rules.push({
        id: "SEATING_GT_200",
        condition: { seating_gt: 200 },
        requirement: "לעסק עם מעל 200 מקומות ישיבה יש דרישות מיוחדות",
      });
    }
    if (/עד\s*200\s*מקומות\s*ישיבה/.test(text)) {
      rules.push({
        id: "SEATING_LTE_200",
        condition: { seating_lte: 200, alcohol: false },
        requirement:
          "עסק עד 200 מקומות ישיבה ללא מכירת/הגשת/צריכת אלכוהול פטור מדרישות מסוימות",
      });
    }

    if (
      /(בשר|עוף|עופות|דגים|בישול|טיפול טרמי|צלייה|טיגון|אפייה|ביצים)/.test(text)
    ) {
      rules.push({
        id: "FEATURE_HOT_PREP",
        condition: { features: ["meat", "fish"] },
        requirement:
          "לבשל בשר/עופות/דגים עד חימום מלא (72°C למשך 2 דקות בנקודה הקרה), לקרר במהירות אם מוגש קר, ולאחסן בטמפרטורות מתאימות",
      });
    }

    if (/(גפ.?\"?מ|גז|בלוני\s*גז|מערכת\s*גפ.?\"?מ)/.test(text)) {
      rules.push({
        id: "FEATURE_GAS_LPG",
        condition: { features: ["gas"] },
        requirement:
          'מערכת גפ"מ וציוד נלווים במצב תקין ומתוחזק; לשמור בעסק אישורים (מטפים לפי ת"י 129/1, בדיקת חשמל/תאורות חירום).',
      });
    }
    fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2), "utf8");

    console.log("✓ raw saved to:", rawPath);
    console.log("✓ rules saved to:", rulesPath);
  } catch (err) {
    console.error("❌ Extract failed:", err);
    process.exit(1);
  }
}

extract();

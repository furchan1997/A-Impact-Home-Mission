// בודק אילו חוקים רלוונטיים לנתוני העסק לפי התנאים שהוגדרו בקובץ rules.json
import rules from "../out/rules.json" assert { type: "json" };
// פונקצייה שבודקת התאמה עם הנתונים שהתקבלו מהלקוח אל מול מה שמצופה לפי הקובץ JSON
export function matchRules({
  seats,
  alcohol = false,
  servingFood = false,
  gas = false,
}) {
  const nSeats = Number(seats) || 0; // המרת מספר מקומות ישיבה למספר תקין (כולל טיפול בערך ריק/לא חוקי)

  const matched = []; // מערך שיאגור את כל החוקים שעברו את תנאי ההתאמה

  // בדיקה לפי כמות מקומות ישיבה והאם מוגש אלכוהול
  if (nSeats <= rules[0].condition.seating_lte && alcohol === false) {
    matched.push(rules[0]);
  }

  // אם קיימת הגשה של מוצרים מין החי אז נוסיף גם את החוק הזה למערך ההאתמה
  if (servingFood) {
    matched.push(rules[1]);
  }

  // אם קיים מערכת גז או גפ''מ אז נכניס גם את החוק הזה למערך ההתאמה
  if (gas) {
    matched.push(rules[2]);
  }

  return matched; // מחזיר את רשימת החוקים שעברו האתמה
}

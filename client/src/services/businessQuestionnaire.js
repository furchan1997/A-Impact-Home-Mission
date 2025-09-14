import { httpsService } from "./httpServise";

// שליחה לשרת עם הפרמטר של הנתונים שמצופים להתקבל בגוף הבקשה
// השרת מצפה לאובייקט עם כל הפרמטרים (bizName, bizSize, seats, alcohol, servingFood, gas)
function createQuestionnaire(data) {
  return httpsService.post("/questionnaire", data);
}

// ייצוא מסודר של הפונקציות
// כרגע זו רק פונקציה אחת אבל אני מכין תשתית כאשר האפליקציה תיהיה רחבה וגדולה יותר
export const questionnaire = {
  createQuestionnaire,
};

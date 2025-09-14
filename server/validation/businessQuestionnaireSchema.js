import joi from "joi";

// פונקציית ולידציה לנתוני השאלון העסקי.
// בודקת שכל השדות הנדרשים קיימים ועומדים בכללים המוגדרים.
export function businessQuestionnaireSchema(data) {
  const schema = joi.object({
    // שם עסק – מחרוזת חובה, מינימום 2 תווים
    bizName: joi.string().required().min(2).messages({
      "string.empty": "שם העסק הוא שדה חובה",
      "string.min": "שם העסק חייב להכיל לפחות 2 תווים",
    }),

    // גודל העסק במ"ר – מספר חיובי גדול מ-0
    bizSize: joi.number().min(1).required().messages({
      "number.base": "גודל העסק חייב להיות מספר",
      "number.min": "גודל העסק לא יכול להיות שלילי או שווה ל-0",
      "any.required": "גודל העסק הוא שדה חובה",
    }),

    // מספר מקומות ישיבה/תפוסה – מספר >= 0
    seats: joi.number().min(0).required().messages({
      "number.base": "מספר מקומות חייב להיות מספר",
      "number.min": "מספר מקומות לא יכול להיות שלילי",
      "any.required": "מספר מקומות הוא שדה חובה",
    }),

    // שלושה שדות בוליאניים חובה – מציינים מאפייני העסק
    servingFood: joi.boolean().required(), // האם מוגש אוכל
    gas: joi.boolean().required(), // האם קיימת מערכת גז
    alcohol: joi.boolean().required(), // האם מוגש אלכוהול
  });

  // החזרת תוצאת הולידציה:
  // - abortEarly:false – אוסף את כל השגיאות יחד, לא עוצר בראשונה
  // - convert:true – ממיר סוגי ערכים במידת הצורך (למשל "1" -> 1)
  // - stripUnknown:true – מסיר שדות שלא הוגדרו בסכמה
  return schema.validate(data, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });
}

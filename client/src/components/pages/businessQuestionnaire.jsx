import Input from "../input";
import { useFormik } from "formik";
import { questionnaire } from "../../services/businessQuestionnaire";
import joi from "joi";
import { useState } from "react";
import ReportCard from "../reportCard";

// רכיב אשר יטפל בחחוית ה-UI עבור השאלון למשתמשים, בו יוצג הדו''ח, שגיאות וטעינות ידידותיות למשתמשים במקרה הצורך
function BusinessQuestionnaire() {
  const [reoprt, setReoprt] = useState(""); // סטטיט שישמור את הד''וח בינה ויציג למשתמש
  const [rules, setRules] = useState([]); // סטייט שיחזיק את רשימת החוקים שהותאמו מהשרת
  const [loading, setLoading] = useState(false); // סטייט שיציין האם אנחנו בהתליך שליחה/קבלת תשובה
  const [isGenerate, setIsGenerate] = useState(false); // קובע האם להציג את השאלון או את הדו''ח שנוצר
  const [error, setError] = useState(null); // אחסון בסטייט לצורך הודעת שגיאה במידה והקריאה לשרת נכשלה

  const form = useFormik({
    validateOnMount: false, // למען ביצוע ולידציה רק בעת ניסיון השליחה

    initialValues: {
      bizName: "",
      bizSize: 0,
      seats: 0,
      servingFood: false,
      gas: false,
      alcohol: false,
    },

    // ולידצייה בעזרת JOI למען שיפור חווית המשתמש , הצגת הבעיות והשגיאות בצורה מפורטת ובכדי שהתקבלו נתונים רלוונטים להשוואה והיצירת הדו''ח
    validate(data) {
      const schema = joi.object({
        bizName: joi.string().required().min(2).messages({
          "string.empty": "שם העסק הוא שדה חובה",
          "string.min": "שם העסק חייב להכיל לפחות 2 תווים",
        }),
        bizSize: joi.number().min(1).required().messages({
          "number.base": "גודל העסק חייב להיות מספר",
          "number.min": "גודל העסק לא יכול להיות שלילי או שווה ל-0",
          "any.required": "גודל העסק הוא שדה חובה",
        }),
        seats: joi.number().min(0).required().messages({
          "number.base": "מספר מקומות חייב להיות מספר",
          "number.min": "מספר מקומות לא יכול להיות שלילי",
          "any.required": "מספר מקומות הוא שדה חובה",
        }),
        servingFood: joi.boolean().required(),
        gas: joi.boolean().required(),
        alcohol: joi.boolean().required(),
      });

      const { error } = schema.validate(data, { abortEarly: false });
      let errors = {};

      if (!error) return null;

      for (const detail of error.details) {
        const path = detail.path[0]; // מחזיר את שם הדשה שכשל
        errors[path] = detail.message; // מיפוי הודעות השגיאה לדשה המתאים לו
      }

      return errors;
    },

    async onSubmit(data) {
      setLoading(true); // מציין שהתחילה השליחה
      setIsGenerate(false); // איפוס תצוגת קודמת של הדו''ח
      setError(null); // מנקה שגיאות קודמות
      try {
        const response = await questionnaire.createQuestionnaire(data); // שליחת נתונים לשרת

        setRules(response?.data?.matchedRules); // שמירת החוקים הקשיחים שהתאימו

        setReoprt(response?.data?.aiReport); // שמירת הדו''ח שיתקבל מה-AI
        setLoading(false);
        if (response.status === 200) {
          setIsGenerate(true); // אם התקבלו הנתונים מהשרת מציג את הדו''ח ומשנה את תצוגת הדפדפן
        }
        return response;
      } catch (err) {
        setError(err?.message || "שגיאה, אנא נסה שנית."); // הצגת שגיאה מהשרת או שגיאה ידנית למקרה הצורך
      } finally {
        setLoading(false); // בכל מקרה נסמן שהסתיים תהליך הטעינה
      }
    },
  });
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mb-3">
      {!isGenerate && ( // אם עדיין לא נוצר דו''ח אז נציג את השאלון
        <>
          <h1>שאלון עבור בית עסק</h1>
          <form onSubmit={form.handleSubmit} noValidate autoComplete="off">
            <Input
              lable={"שם העסק"}
              id={"bizName"}
              name={"bizName"}
              {...form.getFieldProps("bizName")} // קישור של השדה ל-FORMIK
              error={form?.touched?.bizName && form?.errors["bizName"]} // הצגת שגיאה אם קיימת
              required
              inputType={"text"}
            />
            <Input
              lable={"גודל העסק במ''ר"}
              inputType={"number"}
              id={"bizSize"}
              name={"bizSize"}
              {...form.getFieldProps("bizSize")}
              error={form?.touched?.bizSize && form?.errors["bizSize"]}
              required
            />
            <Input
              lable={"מספר מקומות ישיבה/תפוסה"}
              id={"seats"}
              name={"seats"}
              inputType={"number"}
              {...form.getFieldProps("seats")}
              error={form?.touched?.seats && form?.errors["seats"]}
              required
            />
            <Input
              isCheckBoxInput
              lable={"יש הגשה של בשר/עופות/דגים"}
              id={"servingFood"}
              name={"servingFood"}
              checked={form.values.servingFood} // ערך נוכח מ-FORMIK
              onChange={
                (e) => form.setFieldValue("servingFood", e.target.checked) // עדכון ידני של ערך הצ'קבוקס
              }
            />
            <Input
              isCheckBoxInput
              lable={"האם קיימת מערכת גז/גפ''מ"}
              id={"gas"}
              name={"gas"}
              checked={form.values.gas}
              onChange={(e) => form.setFieldValue("gas", e.target.checked)}
            />
            <Input
              isCheckBoxInput
              lable={"יש הגשה של אלכוהול"}
              id={"alcohol"}
              name={"alcohol"}
              {...form.getFieldProps("alcohol")}
              checked={form.values.alcohol}
              onChange={(e) => form.setFieldValue("alcohol", e.target.checked)}
            />
            <button className="btn btn-primary fw-bold" type="submit">
              שלח/י
            </button>
          </form>
        </>
      )}
      <ReportCard
        aiReport={reoprt} // תוכן הדו''ח שהגיע מהשרת
        error={error} // הצגת הודעות השגיאה במידה ויש
        loading={loading} // הצגת טעינה אם הבקשה מתעכבת
        matchedRules={rules} // הצגת החוקים שהותאמו לעסק
      />
    </div>
  );
}

export default BusinessQuestionnaire; // ייצוא של הרכיב בלבד

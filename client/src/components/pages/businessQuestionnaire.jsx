import Input from "../input";
import { useFormik } from "formik";
import { questionnaire } from "../../services/businessQuestionnaire";
import joi from "joi";
import { useState } from "react";
import ReportCard from "../reportCard";

function BusinessQuestionnaire() {
  const [report, setReoprt] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const [error, setError] = useState(null);

  const form = useFormik({
    validateOnMount: false,

    initialValues: {
      fullName: "",
      bizSize: 0,
      seats: 0,
      servingFood: false,
      gas: false,
      alcohol: false,
    },

    validate(data) {
      const schema = joi.object({
        fullName: joi.string().required().min(2).messages({
          "string.empty": "שם מלא הוא שדה חובה",
          "string.min": "שם מלא חייב להכיל לפחות 2 תווים",
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
        const path = detail.path[0];
        errors[path] = detail.message;
      }

      return errors;
    },

    async onSubmit(data) {
      setLoading(true);
      setIsGenerate(false);
      setError(null);
      try {
        console.log(data);
        const response = await questionnaire.createQuestionnaire(data);
        console.log(response);
        setReoprt(response?.data?.aiReport);
        setLoading(false);
        if (response.status === 201) {
          setIsGenerate(true);
        }
        return response;
      } catch (err) {
        console.log(err);
        console.log(error);
        setError(err?.message || "שגיאה, אנא נסה שנית.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="d-flex flex-column justify-content-center align-items-center ">
      {!isGenerate && (
        <>
          <h1>שאלון עבור בית עסק</h1>
          <form onSubmit={form.handleSubmit} noValidate autoComplete="off">
            <Input
              label={"שם מלא"}
              id={"fullName"}
              name={"fullName"}
              {...form.getFieldProps("fullName")}
              error={form?.touched?.fullName && form?.errors["fullName"]}
            />
            <Input
              label={"גודל העסק במ''ר"}
              inputType={"number"}
              id={"bizSize"}
              name={"bizSize"}
              {...form.getFieldProps("bizSize")}
              error={form?.touched?.bizSize && form?.errors["bizSize"]}
            />
            <Input
              label={"מספר מקומות ישיבה/תפוסה"}
              id={"seats"}
              name={"seats"}
              {...form.getFieldProps("seats")}
              error={form?.touched?.seats && form?.errors["seats"]}
            />
            <Input
              isCheckBoxInput
              label={"יש הגשה של בשר/עופות/דגים"}
              id={"servingFood"}
              name={"servingFood"}
              checked={form.values.servingFood}
              onChange={(e) =>
                form.setFieldValue("servingFood", e.target.checked)
              }
            />
            <Input
              isCheckBoxInput
              label={"האם קיימת מערכת גז/גפ''מ"}
              id={"gas"}
              name={"gas"}
              checked={form.values.gas}
              onChange={(e) => form.setFieldValue("gas", e.target.checked)}
            />
            <Input
              isCheckBoxInput
              label={"יש הגשה של אלכוהול"}
              id={"alcohol"}
              name={"alcohol"}
              {...form.getFieldProps("alcohol")}
              checked={form.values.alcohol}
              onChange={(e) => form.setFieldValue("alcohol", e.target.checked)}
            />
            <button type="submit">שלח/י</button>
          </form>
        </>
      )}
      <ReportCard
        aiReport={report}
        error={error}
        loading={loading}
        matchedRules={rules}
      />
    </div>
  );
}

export default BusinessQuestionnaire;

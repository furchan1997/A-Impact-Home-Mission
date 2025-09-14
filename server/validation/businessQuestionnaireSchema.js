import joi from "joi";

export function businessQuestionnaireSchema(data) {
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

  return schema.validate(data, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });
}

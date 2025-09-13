import { httpsServise } from "./httpServise";

function createQuestionnaire(data) {
  return httpsServise.post("/questionnaire", data);
}

export const questionnaire = {
  createQuestionnaire,
};

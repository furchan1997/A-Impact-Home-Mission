import Input from "../input";

function BusinessQuestionnaire() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>שאלון עבור בית עסק</h1>
      <Input lable={"שם מלא"} />
      <Input lable={"גודל העסק במ''ר"} inputType={"number"} />
      <Input lable={"מספר מקומות ישיבה/תפוסה"} />
      <Input isCheckBoxInput lable={"יש הגשה של בשר/עופות/דגים"} />
      <Input isCheckBoxInput lable={"האם קיימת מערכת גז/גפ''מ"} />
      <button>שלח/י</button>
    </div>
  );
}

export default BusinessQuestionnaire;

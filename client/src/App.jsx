import { useState } from "react";
import "./App.css";
import BusinessQuestionnaire from "./components/pages/businessQuestionnaire";
import Summary from "./components/pages/summary";

function App() {
  return (
    <>
      <div className={"app min-vh-100 d-flex flex-column rtl"}>
        <Summary />
        <BusinessQuestionnaire />
      </div>
    </>
  );
}

export default App;

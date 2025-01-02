import { React, useEffect } from "react";
import "./IntroductionPage.scss";

const IntroductionPage = () => {
  return (
    <div>
      <h1>Welcome to the Introduction Page</h1>
      <p>This page provides an overview of the application and its features. </p>
      <p>You can download the data files <a href="/data/240826_total_1296_0.csv" download>here</a>.</p>
    </div>
  );
};

export default IntroductionPage;

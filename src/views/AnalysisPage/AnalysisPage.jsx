import { React, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

import "./AnalysisPage.scss";
import { UserStore } from "../../store/UserStore.js";

const AnalysisPage = () => {
  const setUserID = UserStore((state) => state.setUserID);

  return (
    <div className="vertical">
      <BarChart
        xAxis={[
          {
            id: 'barCategories',
            data: ['bar A', 'bar B', 'bar C'],
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: [2, 5, 3],
          },
        ]}
        width={500}
        height={300}
      />
      {[...Array(12).keys()].map((item, index) => {
        return <img src={"/COVID-" + (index + 1) + ".png"} className="logo" />;
      })}
      {[...Array(12).keys()].map((item, index) => {
        return <img src={"/GlobalWarming-" + (index + 1) + ".png"} className="logo" />;
      })}
      {[...Array(12).keys()].map((item, index) => {
        return <img src={"/HousePrice-" + (index + 1) + ".png"} className="logo" />;
      })}
    </div>
  );
};

export default AnalysisPage;

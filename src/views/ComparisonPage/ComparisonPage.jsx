import { React } from "react";
import { LineChart } from '@mui/x-charts/LineChart';

import {ACCURACY} from "../../../public/accuracy.js";
import "./ComparisonPage.scss";
import { UserStore, CATS } from "../../store/UserStore.js";
import { getAVGofAttributes } from "../../dataprocessing/utils.jsx";

const ComparisonPage = () => {
  const sortBy2 = UserStore((state) => state.sortBy2);

  return (
    <div className="vertical">
      <div className="imagerow">
        <LineChart
          onMarkClick={(e, item) => {
            // console.log(item);
          }}
          dataset={ACCURACY[sortBy2]}
          xAxis={[
            {
              id: 'barCategories',
              dataKey: 'bin',
              scaleType: 'band',
              tickPlacement: 'middle'
            },
          ]}
          
          yAxis={[{ min: 0, max: 1, tickNumber: 10, }]}
          series={[{ dataKey: 'accuracy', label: 'Accuracy' }]}
          width={1000}
          height={400}
          grid={{
            horizontal: true,
          }}
          // barLabel={(item, context) => {
          //   return item.value.toFixed(2)
          // }}
        />
      </div>
    </div>
  );
};

export default ComparisonPage;

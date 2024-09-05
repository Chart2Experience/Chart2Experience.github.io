import { React } from "react";
import { LineChart } from '@mui/x-charts/LineChart';

import { ACCURACY } from "../../../public/accuracy_bin2.js";
import { ACCURACY_CASES } from "../../../public/accuracy_bin2_cases.js";
import "./ComparisonPage.scss";
import { UserStore, CATS } from "../../store/UserStore.js";
import { getAVGofAttributes } from "../../dataprocessing/utils.jsx";

const ComparisonPage = () => {
  const sortBy2 = UserStore((state) => state.sortBy2);
  const bin = UserStore((state) => state.bin);
  const setBin = UserStore((state) => state.setBin);

  return (
    <div className="vertical">
      <div className="imagerow">
        <LineChart
          onMarkClick={(e, item) => {
            setBin(item.dataIndex);
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
          series={[{
            dataKey: 'accuracy',
            label: 'Accuracy',
            valueFormatter: (code, context) => {
              let found = ACCURACY[sortBy2].find((d) => d.accuracy === code);
              return `${found.correct}/${found.count} = ${code.toFixed(2)}`;
            }
          }]}
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
      <div className="hliner" />
      {
        (sortBy2 != "default") && 
        (bin != null) && 
        ACCURACY_CASES[sortBy2][bin]['cases'].filter(e => e[3] == false).map((e, idx) => {
          return(
            <div className="comparisonrow">
              <div className="thumbnail-comparison">
                {e[0]}
                <img  src={"/" + e[0] + ".png"} />
              </div>
              <div className="thumbnail-comparison">
                {e[1]}
                <img  src={"/" + e[1] + ".png"} />
              </div>
              <div className="reason-comparison">Score Differece: {e[2].toFixed(2)} ({e[2]>0?"left":"right"} is higher)<br/>LLM predicted {e[3] == true?"well":"wrong"}<br/>{e[4].slice(2, -2)}</div>
            </div>
          )
        })
      }
    </div>
  );
};

export default ComparisonPage;

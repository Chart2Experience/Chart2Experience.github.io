import { React, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

import ChartsView from "./ChartsView.jsx";

import "./AnalysisPage.scss";
import { UserStore, CATS, CATS_WHY } from "../../store/UserStore.js";

const getAVGofAttributes = (fullData, currentImage) => {
  const dataWithChartname = fullData.filter((e) => e.chart_name == currentImage);
  // get average of attributes
  const avgs = CATS.map((cat) => {
    let count = 0; // number of non-zero
    return dataWithChartname.reduce((acc, e) => {
      if (parseInt(e[cat]) > 0) {
        count++;
      }
      return acc + parseInt(e[cat])
    }, 0) / count
  });

  // console.log(dataWithChartname, avgs)
  return avgs
}

const getCountinAttribute = (fullData, currentImage, currentAttribute) => {
  const dataWithChartname = fullData.filter((e) => e.chart_name == currentImage);
  const scoresSelected = dataWithChartname.map((e) => e[currentAttribute]);
  return [...Array(7).keys()].map((item, index) =>
    scoresSelected.filter(x => x == (item + 1)).length
  );
}

const getWHYofAttributes = (fullData, currentImage, currentAttribute, currentScore) => {
  const dataWithChartname = fullData.filter((e) => e.chart_name == currentImage);
  const selectedWhy = dataWithChartname.map((e) => [e[currentAttribute], e[currentAttribute + "-why"]]);
  // console.log(currentAttribute, selectedWhy)
  const sorted = selectedWhy.sort((a, b) => {
    return a[0] - b[0];
  });
  return (currentScore != 0 ? sorted.filter((e) => e[0] == parseInt(currentScore)) : sorted).map((e) => <div>{e[0]}: {e[1]}</div>);
}

const AnalysisPage = () => {
  const setUserID = UserStore((state) => state.setUserID);
  const currentImage = UserStore((state) => state.currentImage);
  const setCurrentImage = UserStore((state) => state.setCurrentImage);
  const loaded = UserStore((state) => state.loaded);
  const currentAttribute = UserStore((state) => state.currentAttribute);
  const setCurrentAttribute = UserStore((state) => state.setCurrentAttribute);
  const currentScore = UserStore((state) => state.currentScore);
  const setCurrentScore = UserStore((state) => state.setCurrentScore);

  return (
    <div className="vertical">
      <ChartsView />
      <div className="hliner" />
      <div className="imagerow">
        {
          currentImage != 0 ?
            <div>
              <BarChart
                onItemClick={(e, item) => {
                  // console.log(item);
                  setCurrentAttribute(CATS[item.dataIndex]);
                }}
                xAxis={[
                  {
                    id: 'barCategories',
                    data: CATS,
                    scaleType: 'band',
                    tickPlacement: 'middle'
                  },
                ]}
                yAxis={[
                  {
                    min: 0,
                    max: 7,
                    tickNumber: 7,
                  }
                ]}
                series={[
                  {
                    data: getAVGofAttributes(loaded, currentImage),
                  },
                ]}
                width={500}
                height={300}
                grid={{
                  horizontal: true,
                }}
                barLabel={(item, context) => {
                  return item.value.toFixed(2)
                }}
              />
            </div> : <div className="chartWrapper"></div>
        }
        {
          currentImage != 0 ?
            <div className="whyWrapper">
              <BarChart
                onItemClick={(e, item) => {
                  // console.log(item);
                  setCurrentScore(item.dataIndex + 1);
                }}
                xAxis={[
                  {
                    id: 'barCategories',
                    data: [...Array(7).keys().map(e => e + 1)],
                    scaleType: 'band',
                    tickPlacement: 'middle'
                  },
                ]}
                yAxis={[
                  {
                    min: 0,
                    max: 20,
                    tickNumber: 10,
                  }
                ]}
                series={[
                  {
                    data: getCountinAttribute(loaded, currentImage, currentAttribute),
                  },
                ]}
                width={500}
                height={300}
                grid={{
                  horizontal: true,
                }}
                barLabel="value"
              />
              <div className="whyName">{currentAttribute}</div>
              <div className="whyExplanation">{getWHYofAttributes(loaded, currentImage, currentAttribute, currentScore)}</div>
            </div> : <></>
        }
      </div>
    </div>
  );
};

export default AnalysisPage;

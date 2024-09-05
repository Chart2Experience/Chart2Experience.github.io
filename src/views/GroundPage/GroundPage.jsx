import { React, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

import ChartsView from "./ChartsView.jsx";

import "./GroundPage.scss";
import { UserStore, CATS, CATS_WHY } from "../../store/UserStore.js";
import { getAVGofAttributes, getCountinAttribute, getWHYofAttributes } from "../../dataprocessing/utils.jsx";

const GroundPage = () => {
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

export default GroundPage;

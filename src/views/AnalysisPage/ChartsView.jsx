import { React } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

import "./AnalysisPage.scss";
import { UserStore, SORTS, CATS, CATS_WHY } from "../../store/UserStore.js";

const ChartsView = () => {
  const sortBy = UserStore((state) => state.sortBy);
  const setSortBy = UserStore((state) => state.setSortBy);

  const currentImage = UserStore((state) => state.currentImage);
  const setCurrentImage = UserStore((state) => state.setCurrentImage);

  const loadedMean = UserStore((state) => state.loadedMean);

  return (
    <div className="vertical">
      <div>
        {
          SORTS.map((item, index) => {
            return (
              <button
                className="sortButton"
                onClick={() => {
                  setSortBy(item);
                }}
              >
                {item}
              </button>
            );
          })
        }
      </div>

      {sortBy == "default" ?
        <>
          <div className="imagerow">
            {[...Array(6).keys()].map((item, index) => {
              return (
                <div className="imageWrapper"><img
                  src={"/COVID-" + (index + 1) + ".png"}
                  className="logo"
                  onClick={() => {
                    setCurrentImage("COVID-" + (index + 1));
                  }}
                /></div>
              );
            })}
          </div>
          <div className="imagerow">
            {[...Array(6).keys()].map((item, index) => {
              return (
                <div className="imageWrapper"><img
                  src={"/COVID-" + (index + 7) + ".png"}
                  className="logo"
                  onClick={() => {
                    setCurrentImage("COVID-" + (index + 7));
                  }}
                /></div>
              );
            })}
          </div>
          <div className="hliner" />
          <div className="imagerow">
            {[...Array(6).keys()].map((item, index) => {
              return (
                <div className="imageWrapper"><img
                  src={"/GlobalWarming-" + (index + 1) + ".png"}
                  className="logo"
                  onClick={() => {
                    setCurrentImage("GlobalWarming-" + (index + 1));
                  }}
                /></div>
              );
            })}
          </div>
          <div className="imagerow">
            {[...Array(6).keys()].map((item, index) => {
              return (
                <div className="imageWrapper"><img
                  src={"/GlobalWarming-" + (index + 7) + ".png"}
                  className="logo"
                  onClick={() => {
                    setCurrentImage("GlobalWarming-" + (index + 7));
                  }}
                /></div>
              );
            })}
          </div>
          <div className="hliner" />
          <div className="imagerow">
            {[...Array(6).keys()].map((item, index) => {
              return (
                <div className="imageWrapper"><img
                  src={"/HousePrice-" + (index + 1) + ".png"}
                  className="logo"
                  onClick={() => {
                    setCurrentImage("HousePrice-" + (index + 1));
                  }}
                /></div>
              );
            })}
          </div>
          <div className="imagerow">
            {[...Array(6).keys()].map((item, index) => {
              return (
                <div className="imageWrapper"><img
                  src={"/HousePrice-" + (index + 7) + ".png"}
                  className="logo"
                  onClick={() => {
                    setCurrentImage("HousePrice-" + (index + 7));
                  }}
                /></div>
              );
            })}
          </div>
        </> :
        <BarChart
          onItemClick={(e, item) => {
            console.log(loadedMean);
            setCurrentImage(loadedMean[item.dataIndex].chart_name);
          }}
          dataset={loadedMean.sort((a, b) => b[sortBy] - a[sortBy])}
          xAxis={[{ scaleType: 'band', dataKey: 'chart_name', valueFormatter: (v) => (v === null ? '' : v) }]}
          yAxis={[
            {
              min: 0,
              max: 7,
              tickNumber: 7,
            }
          ]}
          grid={{
            horizontal: true,
          }}
          series={[{ dataKey: sortBy }]}
          width={1200}
          height={500}
          bottomAxis={{
            tickLabelStyle: {
              angle: 45,
              textAnchor: 'start',
              fontSize: 12,
            },
          }}
          tooltip={{ trigger: 'axis' }}
        />
      }
    </div>
  );
};

export default ChartsView;

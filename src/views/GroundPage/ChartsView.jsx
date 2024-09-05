import { React } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

import "./GroundPage.scss";
import { UserStore, SORTS, CATS, CATS_WHY } from "../../store/UserStore.js";

const ChartsView = () => {
  const sortBy = UserStore((state) => state.sortBy);
  const setSortBy = UserStore((state) => state.setSortBy);

  const currentImage = UserStore((state) => state.currentImage);
  const setCurrentImage = UserStore((state) => state.setCurrentImage);

  const loadedMean = UserStore((state) => state.loadedMean);
  const setLoadedMean = UserStore((state) => state.setLoadedMean);

  return (
    <div className="vertical">
      <div className="imagerow">
        {sortBy == "default" ?<div className="imagecol">
            {[...Array(12).keys()].map((item, index) => {
              return (
                <div className="imagerow">
                  <div className="imageWrapper">
                    <img
                      className="thumbnail"
                      src={"/COVID-" + (index + 1) + ".png"}
                      onClick={() => {
                        setCurrentImage("COVID-" + (index + 1));
                      }}
                    />
                  </div>
                  <div className="imageWrapper">
                    <img
                      className="thumbnail"
                      src={"/GlobalWarming-" + (index + 1) + ".png"}
                      onClick={() => {
                        setCurrentImage("GlobalWarming-" + (index + 1));
                      }}
                    />
                  </div>
                  <div className="imageWrapper">
                    <img
                      className="thumbnail"
                      src={"/HousePrice-" + (index + 1) + ".png"}
                      onClick={() => {
                        setCurrentImage("HousePrice-" + (index + 1));
                      }}
                    />
                  </div>
                </div>
              );
            })}</div>
           :
          <BarChart
            onItemClick={(e, item) => {
              setCurrentImage(loadedMean[item.dataIndex].chart_name);
            }}
            dataset={loadedMean}
            yAxis={[{ scaleType: 'band', dataKey: 'chart_name' }]}
            xAxis={[{ min: 0, max: 7, tickNumber: 7, }]}
            grid={{ vertical: true, }}
            series={[{ dataKey: sortBy, valueFormatter: (v) => v.toFixed(2) }]}
            width={400}
            height={500}
            leftAxis={{ tickLabelStyle: { fontSize: 10, } }}
            layout="horizontal"
            margin={{ left: 120, }}
          />
        }
        <div style={{
          display: "flex",
          width: "calc(100% - 400px)",
          alignItems: "center",
          justifyContent: "center",
          }}>
          <img src={"/" + currentImage + ".png"} />
        </div>
      </div>
    </div>
  );
};

export default ChartsView;

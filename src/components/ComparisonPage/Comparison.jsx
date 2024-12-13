import React, { useMemo, useState } from "react";
import Plot from 'react-plotly.js';

import { ACCURACY_CASES } from "../../../public/data/accuracy_bin2_cases.js";
import "./Comparison.scss";
import { UserStore, CATS } from "../../store/UserStore.js";

const Comparison = () => {
  const [selectedModel, setSelectedModel] = useState('GPT4o');
  const sortBy2 = UserStore((state) => state.sortBy2);
  const bin = UserStore((state) => state.bin);
  const setBin = UserStore((state) => state.setBin);

  // Get available models dynamically
  const availableModels = useMemo(() => {
    return Object.keys(ACCURACY_CASES);
  }, []);

  // Prepare data for Plotly line chart
  const plotlyData = useMemo(() => {
    if (sortBy2 === "default") return [];

    const accuracyData = ACCURACY_CASES[selectedModel][sortBy2];
    return [{
      x: accuracyData.map(item => item.bin),
      y: accuracyData.map(item => item.accuracy),
      type: 'scatter',
      mode: 'lines+markers',
      marker: {
        size: 10,
        color: accuracyData.map((_, index) => 
          bin === index ? 'red' : 'blue'
        ),
        line: { width: 2, color: 'DarkSlateGrey' }
      },
      text: accuracyData.map(item => 
        `${item.correct}/${item.count} = ${item.accuracy.toFixed(2)}`
      ),
      hoverinfo: 'text'
    }];
  }, [sortBy2, bin, selectedModel]);

  const handlePlotClick = (event) => {
    if (event.points && event.points.length > 0) {
      const clickedPointIndex = event.points[0].pointIndex;
      setBin(clickedPointIndex);
    }
  };

  const filteredCases = useMemo(() => {
    if (sortBy2 === "default" || bin === null) {
      return [];
    }
    
    return ACCURACY_CASES[selectedModel][sortBy2][bin]['cases']
      .filter((e) => !e[3])
      .map((e, idx) => (
        <div key={idx} className="comparison-row">
          <div className="comparison-images">
            <div className="image-pair">
              <img src={`https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/image/${e[0]}.png`} alt={`Left ${e[0]}`} />
              <img src={`https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/image/${e[1]}.png`} alt={`Right ${e[1]}`} />
            </div>
          </div>
          <div className="comparison-details">
            <div className="score-info">
              <span className="score-difference">
                {e[2] > 0 ? "Left" : "Right"} Higher (+{Math.abs(e[2]).toFixed(2)})
              </span>
              <span className="prediction-status">
                {e[3] ? "Predicted Well" : "Prediction Wrong"}
              </span>
            </div>
            <div className="reason-text">
              {e[4]}
            </div>
          </div>
        </div>
      ));
  }, [sortBy2, bin, selectedModel]);

  return (
    <div className="comparison-container">
      <div className="model-selector">
        {availableModels.map(model => (
          <button
            key={model}
            className={`model-button ${selectedModel === model ? 'active' : ''}`}
            onClick={() => setSelectedModel(model)}
          >
            {model}
          </button>
        ))}
      </div>
      <div className="chart-container">
        <Plot
          data={plotlyData}
          layout={{
            width: 1000,
            height: 300,
            title: `Accuracy by Bin - ${selectedModel}`,
            xaxis: {
              title: 'Bin',
              tickmode: 'array',
              tickvals: plotlyData[0]?.x || [],
              ticktext: plotlyData[0]?.x || []
            },
            yaxis: {
              title: 'Accuracy',
              tickvals: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
              range: [0.33, 1.02]
            },
            shapes: [
              {
                type: 'line',
                x0: 0,
                x1: 1,
                y0: 0.5,
                y1: 0.5,
                xref: 'paper',
                yref: 'y',
                line: {
                  color: 'gray',
                  width: 2,
                  dash: 'dash'
                }
              }
            ],
            grid: { rows: 1, columns: 1 },
            margin: { l: 50, r: 20, t: 50, b: 50 }
          }}
          config={{ responsive: true }}
          onClick={handlePlotClick}
        />
      </div>
      <div className="divider" />
      {sortBy2 !== "default" && bin !== null && filteredCases}
    </div>
  );
};

export default Comparison;
import React, { useMemo, useState } from "react";
import Plot from 'react-plotly.js';

import { ACCURACY_CASES } from "../../../public/data/accuracy_bin2_cases.js";
import "./Comparison.scss";
import { UserStore, CATS } from "../../store/UserStore.js";

const Comparison = () => {
  const attributePair = UserStore((state) => state.attributePair);
  const bin = UserStore((state) => state.bin);
  const setBin = UserStore((state) => state.setBin);
  const currentModelPair = UserStore((state) => state.currentModelPair);
  const [predictionFilter, setPredictionFilter] = useState("All");
  const [samenessFilter, setSamenessFilter] = useState("All");

  const getAccuracyData = (modelName) => {
    if (modelName === "GPT4o") {
      return ACCURACY_CASES['GPT4o'];
    } else if (modelName === "Llama3.2 Vision Instruct") {
      return ACCURACY_CASES['llama'];
    } else if (modelName === "Sonnet 3.5 (1)") {
      return ACCURACY_CASES['sonnet_1'];
    } else if (modelName === "Sonnet 3.5 (2)") {
      return ACCURACY_CASES['sonnet_2'];
    }
  }

  // Prepare data for Plotly line chart
  const plotlyData = useMemo(() => {
    if (attributePair === "default" || currentModelPair === "Human") return [];

    const accuracyData = attributePair === "All" 
      ? Object.keys(getAccuracyData(currentModelPair)).flatMap(att => 
          getAccuracyData(currentModelPair)[att].map(item => ({ ...item, att: att }))
        )
      : getAccuracyData(currentModelPair)[attributePair];

    // If not 'All', return single line as before
    if (attributePair !== "All") {
      return [{
        x: accuracyData.map(item => item.bin),
        y: accuracyData.map(item => item.accuracy),
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
          size: 10,
          color: accuracyData.map((_, index) => bin === index ? '#343148FF' : '#D7C49EFF'),
          line: { width: 1.5, color: 'DarkSlateGrey' }
        },
        text: accuracyData.map(item => 
          `${item.correct}/${item.count} = ${item.accuracy.toFixed(2)}`
        ),
        hoverinfo: 'text'
      }];
    }

    // For 'All', create separate lines for each attribute
    const attributes = [...new Set(accuracyData.map(item => item.att))];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B9B9B'];

    return attributes.map((att, index) => {
      const attData = accuracyData.filter(item => item.att === att);
      return {
        name: att,  // This will show in the legend
        x: attData.map(item => item.bin),
        y: attData.map(item => item.accuracy),
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
          size: 8,
          color: colors[index],
          line: { width: 1.5, color: 'DarkSlateGrey' }
        },
        text: attData.map(item => 
          `${att}: ${item.correct}/${item.count} = ${item.accuracy.toFixed(2)}`
        ),
        hoverinfo: 'text'
      };
    });
  }, [attributePair, bin, currentModelPair]);

  const handlePlotClick = (event) => {
    if (event.points && event.points.length > 0 && attributePair !== "All") {
      const clickedPointIndex = event.points[0].pointIndex;
      setBin(clickedPointIndex);
    }
  };

  const getCases = (modelName) => {
    if (modelName === "GPT4o") {
      return ACCURACY_CASES['GPT4o'][attributePair][bin]['cases']
    } else if (modelName === "Llama3.2 Vision Instruct") {
      return ACCURACY_CASES['llama'][attributePair][bin]['cases']
    } else if (modelName === "Sonnet 3.5 (1)") {
      return ACCURACY_CASES['sonnet_1'][attributePair][bin]['cases']
    } else if (modelName === "Sonnet 3.5 (2)") {
      return ACCURACY_CASES['sonnet_2'][attributePair][bin]['cases']
    } else {
      return ACCURACY_CASES[modelName][attributePair][bin]['cases']
    }
  }

  const filteredCases = useMemo(() => {
    if (attributePair === "All" || bin === null) {
      return [];
    }
    
    return getCases(currentModelPair)
      .filter(e => {
        const matchesPrediction = predictionFilter === "All" || 
          (predictionFilter === "Correct" && e[3]) ||
          (predictionFilter === "Wrong" && !e[3]);
        
        const isSameSubject = e[0].split("-")[0] === e[1].split("-")[0]; // Assuming e[5] contains subject sameness
        const matchesSameness = samenessFilter === "All" ||
          (samenessFilter === "Same" && isSameSubject) ||
          (samenessFilter === "Different" && !isSameSubject);
        
        return matchesPrediction && matchesSameness;
      })
      .map((e, idx) => (
        <div key={idx} className="comparison-row">
          <div className="comparison-images">
            <div className="image-pair">
              <div className="image-name">
                {e[0]}
                <img src={`https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/image/${e[0]}.png`} alt={`Left ${e[0]}`} />
              </div>
              <div className="image-name">
                {e[1]}
                <img src={`https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/image/${e[1]}.png`} alt={`Right ${e[1]}`} />
              </div>
            </div>
          </div>
          <div className="comparison-details">
            <div className="score-info">
              <span className="score-difference">
                {e[2] > 0 ? "Left" : "Right"} Higher ({Math.abs(e[2]).toFixed(2)})
              </span>
              <span className="prediction-status">
                {e[3] ? "Correct" : "Wrong"}
              </span>
            </div>
            <div className="reason-text">
              {e[4]}
            </div>
          </div>
        </div>
      ));
  }, [attributePair, bin, currentModelPair, predictionFilter, samenessFilter]);

  return (
    <div className="comparison-container">
      <div className="chart-container">
        <Plot
          data={plotlyData}
          layout={{
            width: 1000,
            height: 300,
            title: `Accuracy by Bin - ${currentModelPair}`,
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
            margin: { l: 50, r: 20, t: 50, b: 50 },
            ...(attributePair === "All" && {
              legend: {
                x: 0.05,
                y: 1.05,
                xanchor: 'left',
                yanchor: 'top',
                orientation: 'h',
                traceorder: 'normal',
                itemwidth: 10
              }
            })
          }}
          config={{ responsive: true }}
          onClick={handlePlotClick}
        />
      </div>
      <div className="divider" />

      {attributePair !== "default" && bin !== null && (
        <>
          <div className="filters">
            <b>Filters | </b>
            <div className="filter-group">
              <label>Prediction:</label>
              <select 
                value={predictionFilter} 
                onChange={(e) => setPredictionFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Correct">Correct</option>
                <option value="Wrong">Wrong</option>
              </select>
            </div>
            <b> | </b>
            <div className="filter-group">
              <label>Subject:</label>
              <select 
                value={samenessFilter} 
                onChange={(e) => setSamenessFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Same">Same</option>
                <option value="Different">Different</option>
              </select>
            </div>
          </div>
          {filteredCases}
        </>
      )}
    </div>
  );
};

export default Comparison;
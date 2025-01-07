import { React, useEffect } from "react";
import Plot from 'react-plotly.js';

import "./AbsoluteScore.scss";
import { UserStore, CATS, CATS_FULL } from "../../store/UserStore.js";
import { getAVGofFactors, getCountinFactor, getWHYofFactors } from "../../utils/dataWrangling.jsx";
import ChartSelector from './ChartSelector.jsx';

const AbsoluteScore = () => {
  const currentImage = UserStore((state) => state.currentImage);
  const loaded = UserStore((state) => state.loaded);
  
  const claudeScores = UserStore((state) => state.claudeScores);
  const llamaScores = UserStore((state) => state.llamaScores);
  const gptScores = UserStore((state) => state.gptScores);

  const currentFactor = UserStore((state) => state.currentFactor);
  const setCurrentFactor = UserStore((state) => state.setCurrentFactor);
  const currentScore = UserStore((state) => state.currentScore);
  const setCurrentScore = UserStore((state) => state.setCurrentScore);
  const currentModelAbs = UserStore((state) => state.currentModelAbs);

  const getFactorColors = () => {
    return CATS.map(cat => cat === currentFactor ? '#343148FF' : '#D7C49EFF');
  };

  const getScoreColors = () => {
    return [...Array(7).keys()].map(i => (i + 1) === currentScore ? '#343148FF' : '#D7C49EFF');
  };

  const handleFactorClick = (data) => {
    if (data.points && data.points[0]) {
      const clickedFactor = CATS[data.points[0].pointIndex];
      if (clickedFactor === currentFactor) {
        setCurrentFactor(''); // Reset to default
        setCurrentScore(0); // Also reset score when Factor is reset
      } else {
        setCurrentFactor(clickedFactor);
      }
    }
  };

  const handleScoreClick = (data) => {
    if (data.points && data.points[0]) {
      const clickedScore = data.points[0].pointIndex + 1;
      if (clickedScore === currentScore) {
        setCurrentScore(0); // Reset to default
      } else {
        setCurrentScore(clickedScore);
      }
    }
  };

  const getScores = (modelName) => {
    if (modelName === "Human") {
      return loaded;
    } else if (modelName === "GPT-4o") {
      return gptScores;
    } else if (modelName === "Llama-3.2-Vision-Instruct") {
      return llamaScores;
    } else if (modelName === "Claude 3.5 Sonnet") {
      return claudeScores;
    }
  }

  return (
    <div className="vertical">
      <div className="charts-view-container">
        <ChartSelector />
        
        <div className="content-wrapper">
          <div className="main-content">
            <img 
              src={`/image/${currentImage}.png`} 
              alt="Selected" 
              className="selected-image"
            />
          </div>

          <div className="detail-on-image">
            {currentImage != 0 && (
              <>
                <div className="whyWrapper">
                  <div className="plot-wrapper">
                    <Plot
                      data={[
                        {
                          type: 'bar',
                          x: CATS,
                          y: getAVGofFactors(getScores(currentModelAbs), currentImage, currentModelAbs).map(v => Number(v).toFixed(2)),
                          text: getAVGofFactors(getScores(currentModelAbs), currentImage, currentModelAbs).map(v => Number(v).toFixed(2)),
                          textposition: 'auto',
                          marker: {
                            color: getFactorColors(),
                          },
                          hoverinfo: 'x+y',
                          hoverlabel: { cursor: 'pointer' },
                          cursor: 'pointer'
                        }
                      ]}
                      layout={{
                        title: {
                          text: 'Average Scores by Factor',
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        width: 300,
                        height: 150,
                        yaxis: {
                          tickvals: [0, 1, 2, 3, 4, 5, 6, 7],
                          ticktext: ['0', '1', '2', '3', '4', '5', '6', '7'],
                          tickmode: 'array',
                          range: [0, 7],
                          dtick: 1,
                          gridcolor: '#e0e0e0',
                          fixedrange: true,
                          tickformat: '.2f'
                        },
                        margin: {
                          l: 20,
                          r: 10,
                          t: 30,
                          b: 20
                        },
                        plot_bgcolor: 'white',
                        paper_bgcolor: 'white',
                        dragmode: false,
                        xaxis: {
                          fixedrange: true,
                        },
                      }}
                      config={{
                        displayModeBar: false,
                        scrollZoom: false
                      }}
                      onClick={(data) => {
                        handleFactorClick(data);
                      }}
                    />

                    <Plot
                      data={[
                        {
                          type: 'bar',
                          x: [...Array(7).keys()].map(e => e + 1),
                          y: getCountinFactor(getScores(currentModelAbs), currentImage, currentFactor, currentModelAbs).map(v => Number(v)),
                          text: getCountinFactor(getScores(currentModelAbs), currentImage, currentFactor, currentModelAbs).map(v => Number(v)),
                          textposition: 'auto',
                          marker: {
                            color: getScoreColors(),
                          },
                          hoverinfo: 'x+y',
                          hoverlabel: { cursor: 'pointer' },
                          cursor: 'pointer'
                        }
                      ]}
                      layout={{
                        title: {
                          text: 'Score Distribution',
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        width: 300,
                        height: 150,
                        xaxis: {
                          range: [0.5, 7.5],
                          tickvals: [1, 2, 3, 4, 5, 6, 7],
                          ticktext: ['1', '2', '3', '4', '5', '6', '7'],
                          fixedrange: true,
                        },
                        yaxis: {
                          range: [0, 20],
                          dtick: 4,
                          gridcolor: '#e0e0e0',
                          fixedrange: true,
                        },
                        margin: {
                          l: 20,
                          r: 10,
                          t: 30,
                          b: 20
                        },
                        plot_bgcolor: 'white',
                        paper_bgcolor: 'white',
                        dragmode: false,
                      }}
                      config={{
                        displayModeBar: false,
                        scrollZoom: false
                      }}
                      onClick={handleScoreClick}
                    />
                  </div>
                  <div className="factor-title">
                    {currentFactor==''?'Select Factor':'Factor: '
                    + CATS_FULL[CATS.indexOf(currentFactor)]}  /  Score: {currentScore==0?'All':currentScore}</div>
                  <div className="explanation-text">
                    {getWHYofFactors(loaded, currentImage, currentFactor, currentScore, currentModelAbs)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsoluteScore;

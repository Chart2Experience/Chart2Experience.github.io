import { React, useEffect } from "react";
import Plot from 'react-plotly.js';

import "./AbsoluteScore.scss";
import { UserStore, CATS, CATS_FULL } from "../../store/UserStore.js";
import { getAVGofFactors, getCountinFactor, getWHYofFactors } from "../../utils/dataWrangling.jsx";
import ChartSelector from './ChartSelector.jsx';

const MODELS = ["Human", "GPT4o", "llama", "sonnet_1", "sonnet_2"];

const AbsoluteScore = () => {
  const currentImage = UserStore((state) => state.currentImage);
  const loaded = UserStore((state) => state.loaded);
  // read sonnetScores1, sonnetScores2, llamaScores, gpt4Scores from UserStore
  const sonnetScores1 = UserStore((state) => state.sonnetScores1);
  const sonnetScores2 = UserStore((state) => state.sonnetScores2);
  const llamaScores = UserStore((state) => state.llamaScores);
  const gpt4Scores = UserStore((state) => state.gpt4Scores);

  const currentFactor = UserStore((state) => state.currentFactor);
  const setCurrentFactor = UserStore((state) => state.setCurrentFactor);
  const currentScore = UserStore((state) => state.currentScore);
  const setCurrentScore = UserStore((state) => state.setCurrentScore);
  const currentModel = UserStore((state) => state.currentModel);
  const setCurrentModel = UserStore((state) => state.setCurrentModel);

  const getFactorColors = () => {
    return CATS.map(cat => cat === currentFactor ? '#007bff' : '#1f77b4');
  };

  const getScoreColors = () => {
    return [...Array(7).keys()].map(i => (i + 1) === currentScore ? '#007bff' : '#1f77b4');
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
    } else if (modelName === "GPT4o") {
      return gpt4Scores;
    } else if (modelName === "llama") {
      return llamaScores;
    } else if (modelName === "sonnet_1") {
      return sonnetScores1;
    } else if (modelName === "sonnet_2") {
      return sonnetScores2;
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
            <div className="model-selector">
              {MODELS.map((model) => (
                <button
                  key={model}
                  className={`model-button ${model === currentModel ? 'active' : ''}`}
                  onClick={() => setCurrentModel(model)}
                >
                  {model}
                </button>
              ))}
            </div>

            {currentImage != 0 && (
              <>
                <div className="whyWrapper">
                  <div className="plot-wrapper">
                    <Plot
                      data={[
                        {
                          type: 'bar',
                          x: CATS,
                          y: getAVGofFactors(getScores(currentModel), currentImage, currentModel).map(v => Number(v).toFixed(2)),
                          text: getAVGofFactors(getScores(currentModel), currentImage, currentModel).map(v => Number(v).toFixed(2)),
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
                          y: getCountinFactor(getScores(currentModel), currentImage, currentFactor, currentModel).map(v => Number(v)),
                          text: getCountinFactor(getScores(currentModel), currentImage, currentFactor, currentModel).map(v => Number(v)),
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
                    {getWHYofFactors(loaded, currentImage, currentFactor, currentScore, currentModel)}
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

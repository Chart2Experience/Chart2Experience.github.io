import { React, useEffect } from "react";
import Plot from 'react-plotly.js';

import "./GroundPage.scss";
import { UserStore, CATS, CATS_FULL } from "../../store/UserStore.js";
import { getAVGofAttributes, getCountinAttribute, getWHYofAttributes } from "../../utils/dataWrangling.jsx";
import ChartSelector from './ChartSelector';

const MODELS = ["Human", "GPT4o", "llama", "sonnet_1", "sonnet_2"];

const GroundPage = () => {
  const currentImage = UserStore((state) => state.currentImage);
  const loaded = UserStore((state) => state.loaded);
  const currentAttribute = UserStore((state) => state.currentAttribute);
  const setCurrentAttribute = UserStore((state) => state.setCurrentAttribute);
  const currentScore = UserStore((state) => state.currentScore);
  const setCurrentScore = UserStore((state) => state.setCurrentScore);
  const currentModel = UserStore((state) => state.currentModel);
  const setCurrentModel = UserStore((state) => state.setCurrentModel);

  const getAttributeColors = () => {
    return CATS.map(cat => cat === currentAttribute ? '#007bff' : '#1f77b4');
  };

  const getScoreColors = () => {
    return [...Array(7).keys()].map(i => (i + 1) === currentScore ? '#007bff' : '#1f77b4');
  };

  const handleAttributeClick = (data) => {
    if (data.points && data.points[0]) {
      const clickedAttribute = CATS[data.points[0].pointIndex];
      if (clickedAttribute === currentAttribute) {
        setCurrentAttribute(''); // Reset to default
        setCurrentScore(0); // Also reset score when attribute is reset
      } else {
        setCurrentAttribute(clickedAttribute);
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
                          y: getAVGofAttributes(loaded, currentImage).map(v => Number(v).toFixed(2)),
                          text: getAVGofAttributes(loaded, currentImage).map(v => Number(v).toFixed(2)),
                          textposition: 'auto',
                          marker: {
                            color: getAttributeColors(),
                          },
                          hoverinfo: 'x+y',
                          hoverlabel: { cursor: 'pointer' },
                          cursor: 'pointer'
                        }
                      ]}
                      layout={{
                        title: {
                          text: 'Average Scores byAttribute',
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
                        handleAttributeClick(data);
                      }}
                    />

                    <Plot
                      data={[
                        {
                          type: 'bar',
                          x: [...Array(7).keys()].map(e => e + 1),
                          y: getCountinAttribute(loaded, currentImage, currentAttribute).map(v => Number(v)),
                          text: getCountinAttribute(loaded, currentImage, currentAttribute).map(v => Number(v)),
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
                  <div className="attribute-title">
                    {currentAttribute==''?'Select Attribute':'Attribute: '
                    + CATS_FULL[CATS.indexOf(currentAttribute)]}  /  Score: {currentScore==0?'All':currentScore}</div>
                  <div className="explanation-text">
                    {getWHYofAttributes(loaded, currentImage, currentAttribute, currentScore)}
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

export default GroundPage;

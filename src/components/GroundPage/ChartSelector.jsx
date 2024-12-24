import React, { useMemo, useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import "./ChartSelector.scss";
import { UserStore } from "../../store/UserStore.js";

const ChartSelector = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const attributeAbs = UserStore((state) => state.attributeAbs);
  const currentImage = UserStore((state) => state.currentImage);
  const setCurrentImage = UserStore((state) => state.setCurrentImage);
  const loadedMean = UserStore((state) => state.loadedMean);
  const currentModelAbs = UserStore((state) => state.currentModelAbs);

  const getBarColors = () => {
    return loadedMean[currentModelAbs].map(item => item.chart_name === currentImage ? '#343148FF' : '#D7C49EFF');
  };

  const imageRows = useMemo(() => {
    const categories = [
      { id: 'COVID', label: 'COVID' },
      { id: 'GlobalWarming', label: <>Global<br/>Warming</> },
      { id: 'HousePrice', label: <>House<br/>Price</> }
    ];
    
    return (
      <div className="imagecol">
        {categories.map(({ id, label }) => (
          <div className="imagerow" key={`imagerow-${id}`}>
            <div className="topic-label">
              {label}
            </div>
            <div className="images-container">
              {Array(12).fill().map((_, index) => {
                const imageIndex = index + 1;
                const imageName = `${id}-${imageIndex}`;
                return (
                  <div 
                    className="imageWrapper" 
                    key={`imageWrapper-${imageName}`}
                    onClick={() => setCurrentImage(imageName)}
                  >
                    <img 
                      className="thumbnail"
                      src={`/image/${imageName}.png`}
                      alt={`${id} image ${imageIndex}`}
                    />
                    <div className="image-hover-text">
                      {imageName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }, [setCurrentImage]);

  return (
    <div 
      className={`collapsible-section ${isSidebarOpen ? 'open' : ''}`}
      style={{ 
        height: isSidebarOpen ? 'auto' : '50px',
        maxHeight: isSidebarOpen ? '300px' : '50px'
      }}
    >
      {/* <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Hide Images' : 'Show Images'}
      </button> */}
      
      {isSidebarOpen && (
        <div className="sidebar-content">
          {attributeAbs === "default" ? imageRows : (
            <div className="chart-container">
              <Plot
                data={[
                  {
                    type: 'bar',
                    y: loadedMean[currentModelAbs].sort((a, b) => b[attributeAbs] - a[attributeAbs]).map(item => Number(item[attributeAbs]).toFixed(2)),
                    x: loadedMean[currentModelAbs].sort((a, b) => b[attributeAbs] - a[attributeAbs]).map(item => item.chart_name),
                    text: loadedMean[currentModelAbs].sort((a, b) => b[attributeAbs] - a[attributeAbs]).map(item => Number(item[attributeAbs]).toFixed(2)),
                    textposition: 'auto',
                    hoverinfo: 'x+y',
                    marker: {
                      color: getBarColors()
                    },
                    hoverlabel: { cursor: 'pointer' },
                    cursor: 'pointer'
                  }
                ]}
                layout={{
                  width: undefined,
                  height: undefined,
                  autosize: true,
                  margin: {
                    l: 80,
                    r: 20,
                    t: 20,
                    b: 20
                  },
                  dragmode: false,
                  yaxis: {
                    range: [0, 7.1],
                    dtick: 1,
                    gridcolor: '#e0e0e0',
                    fixedrange: true,
                  },
                  xaxis: {
                    tickangle: -45,
                    automargin: true,
                    tickfont: {
                      size: 10
                    },
                    fixedrange: true
                  },
                  plot_bgcolor: 'white',
                  paper_bgcolor: 'white',
                }}
                config={{
                  displayModeBar: false,
                  scrollZoom: false
                }}
                style={{width: '100%', height: '100%'}}
                useResizeHandler={true}
                onClick={(data) => {
                  if (data.points && data.points[0]) {
                    const clickedImage = loadedMean[currentModelAbs][data.points[0].pointIndex].chart_name;
                    if (clickedImage === currentImage) {
                      setCurrentImage(''); // Reset if clicking the same image
                    } else {
                      setCurrentImage(clickedImage);
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartSelector; 
import { useEffect } from 'react'
import './App.scss'
import GroundPage from './components/GroundPage/GroundPage.jsx'
import ComparisonPage from './components/ComparisonPage/ComparisonPage.jsx'
import Papa from 'papaparse';

import { UserStore, TARGETS, SORTS } from "./store/UserStore.js";

function App() {
  const setLoaded = UserStore((state) => state.setLoaded);
  const loadedMean = UserStore((state) => state.loadedMean);
  const setLoadedMean = UserStore((state) => state.setLoadedMean);

  const sortBy = UserStore((state) => state.sortBy);
  const sortBy2 = UserStore((state) => state.sortBy2);
  const setSortBy = UserStore((state) => state.setSortBy);
  const setSortBy2 = UserStore((state) => state.setSortBy2);

  const target = UserStore((state) => state.target);
  const setTarget = UserStore((state) => state.setTarget);


  // load data

  useEffect(() => {
    async function getData() {
      // load data from https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/240826_total_1296_0.csv
      const response = await fetch("https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/240826_total_1296_0.csv");
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const rows = results.data; // array of objects
      setLoaded(rows);

      // const response = await fetch("/data/240826_total_1296_0.csv");
      // const reader = response.body.getReader();
      // const result = await reader.read(); // raw array
      // const decoder = new TextDecoder("utf-8");
      // const csv = decoder.decode(result.value); // the csv text
      // const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      // const rows = results.data; // array of objects
      // setLoaded(rows);
    }

    async function getMeanData() {
      const response = await fetch("https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/mean_ignorenan.csv");
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const rows = results.data; // array of objects
      // parseFloat to all values except chart_name
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (key != "chart_name") {
            row[key] = parseFloat(row[key]);
          }
        });
      });
      console.log(rows);
      setLoadedMean(rows);
    }

    getData();
    getMeanData();
  }, []);

  return (
    <>
      <div id='divstarter'>
        <div className="combined-button-container">
          <div className="button-group">
            {TARGETS.map((item, index) => (
              <button
                key={item}
                className={`menu-button ${target === item ? 'active' : ''}`}
                onClick={() => {
                  setTarget(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="button-group">
            {SORTS.map((item, index) => (
              <button
                key={item}
                className={`menu-button ${
                  (target === "Task 1: Absolute Score" && sortBy === item) || 
                  (target === "Task 2: Pairwise Comparison" && sortBy2 === item) 
                    ? 'active' : ''
                }`}
                onClick={() => {
                  if(target === "Task 1: Absolute Score"){
                    setSortBy(item);
                    setLoadedMean(loadedMean.sort((a, b) => b[item] - a[item]))
                  }else if(target === "Task 2: Pairwise Comparison"){
                    setSortBy2(item);
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {target === "Task 1: Absolute Score" && <GroundPage />}
        {target === "Task 2: Pairwise Comparison" && <ComparisonPage />}
      </div>
    </>
  )
}

export default App

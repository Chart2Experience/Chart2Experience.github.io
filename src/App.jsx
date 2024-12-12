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
      const response = await fetch("/data/240826_total_1296_0.csv");
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const rows = results.data; // array of objects
      setLoaded(rows);
    }

    async function getMeanData() {
      const response = await fetch("/data/mean_ignorenan.csv");
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
                (target === "Absolute Score" && sortBy === item) || 
                (target === "Pairwise Comparison" && sortBy2 === item) 
                  ? 'active' : ''
              }`}
              onClick={() => {
                if(target === "Absolute Score"){
                  setSortBy(item);
                  setLoadedMean(loadedMean.sort((a, b) => b[item] - a[item]))
                }else if(target === "Pairwise Comparison"){
                  setSortBy2(item);
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {target === "Absolute Score" && <GroundPage />}
        {target === "Pairwise Comparison" && <ComparisonPage />}
      </div>
    </>
  )
}

export default App

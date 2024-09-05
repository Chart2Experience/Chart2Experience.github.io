import { useEffect } from 'react'
import './App.css'
import GroundPage from './views/GroundPage/GroundPage.jsx'
import ComparisonPage from './views/ComparisonPage/ComparisonPage.jsx'
import Papa from 'papaparse';

import { UserStore, TARGETS, SORTS } from "./store/UserStore.js";

function App() {
  const setLoaded = UserStore((state) => state.setLoaded);
  const setLoadedMean = UserStore((state) => state.setLoadedMean);

  const setSortBy = UserStore((state) => state.setSortBy);
  const setSortBy2 = UserStore((state) => state.setSortBy2);

  const target = UserStore((state) => state.target);
  const setTarget = UserStore((state) => state.setTarget);


  // load data

  useEffect(() => {
    async function getData() {
      const response = await fetch("/240826_total_1296_0.csv");
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const rows = results.data; // array of objects
      setLoaded(rows);
    }

    async function getMeanData() {
      const response = await fetch("/mean_ignorenan.csv");
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
        <div>
          {
            TARGETS.map((item, index) => {
              return (
                <button
                  className="sortButton"
                  onClick={() => {
                    setTarget(item);
                  }}
                >
                  {item}
                </button>
              );
            })
          }
        </div>
        <div>
          {
            SORTS.map((item, index) => {
              return (
                <button
                  className="sortButton"
                  onClick={() => {
                    if(target == "GROUNDTRUTH"){
                      setSortBy(item);
                      setLoadedMean(loadedMean.sort((a, b) => b[item] - a[item]))
                    }else if(target == "LLM-COMPARISON"){
                      setSortBy2(item);

                    }
                  }}
                >
                  {item}
                </button>
              );
            })
          }
        </div>
        {target == "GROUNDTRUTH" && <GroundPage />}
        {target == "LLM-COMPARISON" && <ComparisonPage />}
      </div >
    </>
  )
}

export default App

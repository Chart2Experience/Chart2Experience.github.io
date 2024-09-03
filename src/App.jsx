import { useEffect } from 'react'
import './App.css'
import AnalysisPage from './views/AnalysisPage/AnalysisPage.jsx'
import Papa from 'papaparse';

import { UserStore } from "./store/UserStore.js";

function App() {
  const setLoaded = UserStore((state) => state.setLoaded);
  const setLoadedMean = UserStore((state) => state.setLoadedMean);

  // load data

  useEffect(() => {
    async function getData() {
        const response = await fetch("/public/240826_total_1296_0.csv");
        const reader = response.body.getReader();
        const result = await reader.read(); // raw array
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value); // the csv text
        const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
        const rows = results.data; // array of objects
        setLoaded(rows);
    }

    async function getMeanData() {
      const response = await fetch("/public/mean_ignorenan.csv");
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const rows = results.data; // array of objects
      console.log(rows);
      setLoadedMean(rows);
  }

    getData();
    getMeanData();
}, []);

  return (
    <>
      <div id='divstarter'>
        <AnalysisPage />
      </div>
    </>
  )
}

export default App

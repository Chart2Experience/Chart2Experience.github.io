import { useEffect } from 'react'
import './App.css'
import AnalysisPage from './views/AnalysisPage/AnalysisPage.jsx'
import Papa from 'papaparse';

import { UserStore } from "./store/UserStore.js";

function App() {
  const setLoaded = UserStore((state) => state.setLoaded);

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
        console.log(rows);
        setLoaded(rows);
    }
    getData();
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

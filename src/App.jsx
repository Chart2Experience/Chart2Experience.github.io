import { useEffect } from 'react'
import './App.scss'
import AbsoluteScore from './components/GroundPage/AbsoluteScore.jsx'
import Comparison from './components/ComparisonPage/Comparison.jsx'
import { UserStore, TARGETS, SORTS } from "./store/UserStore.js";

function App() {
  const loadedMean = UserStore((state) => state.loadedMean);
  const loaded = UserStore((state) => state.loaded);
  const areScoresLoaded = UserStore((state) => state.areScoresLoaded());
  const loadAllData = UserStore((state) => state.loadAllData);
  const setLoadedMean = UserStore((state) => state.setLoadedMean);

  const sortBy = UserStore((state) => state.sortBy);
  const sortBy2 = UserStore((state) => state.sortBy2);
  const setSortBy = UserStore((state) => state.setSortBy);
  const setSortBy2 = UserStore((state) => state.setSortBy2);

  const target = UserStore((state) => state.target);
  const setTarget = UserStore((state) => state.setTarget);

  // load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Show loading indicator if any data is not loaded
  if (!loaded || !loadedMean || !areScoresLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

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
        {target === "Task 1: Absolute Score" && <AbsoluteScore />}
        {target === "Task 2: Pairwise Comparison" && <Comparison />}
      </div>
    </>
  )
}

export default App

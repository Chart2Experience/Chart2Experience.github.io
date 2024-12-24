import { useEffect } from 'react'
import './App.scss'
import AbsoluteScore from './components/GroundPage/AbsoluteScore.jsx'
import Comparison from './components/ComparisonPage/Comparison.jsx'
import { UserStore, TARGETS, SORTS_ABS, SORTS_PAIR, MODELS } from "./store/UserStore.js";

function App() {
  const loadedMean = UserStore((state) => state.loadedMean);
  const loaded = UserStore((state) => state.loaded);
  const areScoresLoaded = UserStore((state) => state.areScoresLoaded());
  const loadAllData = UserStore((state) => state.loadAllData);

  const attributeAbs = UserStore((state) => state.attributeAbs);
  const attributePair = UserStore((state) => state.attributePair);
  const setAttributeAbs = UserStore((state) => state.setAttributeAbs);
  const setAttributePair = UserStore((state) => state.setAttributePair);

  const currentModelAbs = UserStore((state) => state.currentModelAbs);
  const setCurrentModelAbs = UserStore((state) => state.setCurrentModelAbs);
  const currentModelPair = UserStore((state) => state.currentModelPair);
  const setCurrentModelPair = UserStore((state) => state.setCurrentModelPair);

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
            {target === "Task 1: Absolute Score" && SORTS_ABS.map((item, index) => (
              <button
                key={item}
                className={`menu-button ${(attributeAbs === item)? 'active' : ''}`}
                onClick={() => setAttributeAbs(item)}
              >
                {item}
              </button>
            ))}
            {target === "Task 2: Pairwise Comparison" && SORTS_PAIR.map((item, index) => (
              <button
                key={item}
                className={`menu-button ${attributePair === item ? 'active' : ''}`}
                onClick={() => setAttributePair(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="button-group">
            {MODELS.map((item, index) => (
              <button
                key={item}
                className={`menu-button ${
                  (target === "Task 1: Absolute Score" && currentModelAbs === item) || 
                  (target === "Task 2: Pairwise Comparison" && currentModelPair === item)
                    ? 'active' : ''
                }`}
                disabled={(target === "Task 2: Pairwise Comparison" && item === 'Human')}
                onClick={() => {
                  if(target === "Task 1: Absolute Score"){
                    setCurrentModelAbs(item);
                  }else if(target === "Task 2: Pairwise Comparison"){
                    setCurrentModelPair(item);
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

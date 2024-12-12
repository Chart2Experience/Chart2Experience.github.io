import {CATS} from "../store/UserStore.js"

export const getAVGofFactors = (fullData, currentImage, currentModel) => {
  // Handle different model data structures
  if (currentModel === "Human") {
    const dataWithChartname = fullData.filter((e) => e.chart_name === currentImage);
    return CATS.map((cat) => {
      let count = 0;
      return dataWithChartname.reduce((acc, e) => {
        if (parseInt(e[cat]) > 0) {
          count++;
        }
        return acc + parseInt(e[cat])
      }, 0) / (count || 1);
    });
  } else {
    // Handle AI model data
    const modelMap = {
      'GPT4o': 'gpt4Scores',
      'llama': 'llamaScores',
      'sonnet_1': 'sonnetScores1',
      'sonnet_2': 'sonnetScores2'
    };
    
    const scores = fullData[modelMap[currentModel]];
    if (!scores) return CATS.map(() => 0);

    const relevantScores = scores.filter(row => row.chart_name === currentImage);
    return CATS.map(cat => {
      const values = relevantScores.map(row => parseFloat(row[cat])).filter(v => v > 0);
      return values.length ? values.reduce((a, b) => a + b) / values.length : 0;
    });
  }
}

export const getCountinFactor = (fullData, currentImage, currentFactor, currentModel) => {
  if (currentModel === "Human") {
    const dataWithChartname = fullData.filter((e) => e.chart_name === currentImage);
    const scoresSelected = dataWithChartname.map((e) => e[currentFactor]);
    return [...Array(7).keys()].map((item) =>
      scoresSelected.filter(x => parseInt(x) === (item + 1)).length
    );
  } else {
    // Handle AI model data
    const modelMap = {
      'GPT4o': 'gpt4Scores',
      'llama': 'llamaScores',
      'sonnet_1': 'sonnetScores1',
      'sonnet_2': 'sonnetScores2'
    };
    
    const scores = fullData[modelMap[currentModel]];
    if (!scores) return Array(7).fill(0);

    const relevantScores = scores.filter(row => row.chart_name === currentImage);
    const scoresSelected = relevantScores.map(row => row[currentFactor]);
    
    return [...Array(7).keys()].map((item) =>
      scoresSelected.filter(x => parseInt(x) === (item + 1)).length
    );
  }
}

export const getWHYofFactors = (fullData, currentImage, currentFactor, currentScore, currentModel) => {
  if (currentModel === "Human") {
    const dataWithChartname = fullData.filter((e) => e.chart_name === currentImage);
    const selectedWhy = dataWithChartname.map((e) => [e[currentFactor], e[currentFactor + "-why"]]);
    const sorted = selectedWhy.sort((a, b) => a[0] - b[0]);
    return (currentScore !== 0 ? sorted.filter((e) => e[0] == parseInt(currentScore)) : sorted)
      .map((e, idx) => <div key={idx}>{e[0]}: {e[1]}</div>);
  } else {
    // For AI models, we might want to return a message indicating that explanations are not available
    return <div>Explanations not available for AI models</div>;
  }
}
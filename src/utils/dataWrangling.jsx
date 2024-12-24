import {CATS} from "../store/UserStore.js"

export const getAVGofFactors = (fullData, image, model) => {
  // Handle different model data structures
  const dataWithChartname = fullData.filter((e) => e.chart_name === image);
  return CATS.map((cat) => {
    let count = 0;
    return dataWithChartname.reduce((acc, e) => {
      if (parseInt(e[cat]) > 0) {
        count++;
      }
      return acc + parseInt(e[cat])
    }, 0) / (count || 1);
  });
}

export const getCountinFactor = (data, image, factor, model) => {
  const dataWithChartname = data.filter((e) => e.chart_name === image);
  const scoresSelected = dataWithChartname.map((e) => e[factor]);
  return [...Array(7).keys()].map((item) =>
    scoresSelected.filter(x => parseInt(x) === (item + 1)).length
  );
}

export const getWHYofFactors = (fullData, image, factor, score, model) => {
  if (model === "Human") {
    const dataWithChartname = fullData.filter((e) => e.chart_name === image);
    const selectedWhy = dataWithChartname.map((e) => [e[factor], e[factor + "-why"]]);
    const sorted = selectedWhy.sort((a, b) => a[0] - b[0]);
    return (score !== 0 ? sorted.filter((e) => e[0] == parseInt(score)) : sorted)
      .map((e, idx) => <div key={idx}>{e[0]}: {e[1]}</div>);
  } else {
    // For AI models, we might want to return a message indicating that explanations are not available
    return <div>Explanations not available for AI models</div>;
  }
}
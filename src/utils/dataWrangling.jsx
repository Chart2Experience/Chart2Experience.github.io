import {CATS} from "../store/UserStore.js"

export const getAVGofAttributes = (fullData, currentImage) => {
  const dataWithChartname = fullData.filter((e) => e.chart_name == currentImage);
  // get average of attributes
  const avgs = CATS.map((cat) => {
    let count = 0; // number of non-zero
    return dataWithChartname.reduce((acc, e) => {
      if (parseInt(e[cat]) > 0) {
        count++;
      }
      return acc + parseInt(e[cat])
    }, 0) / count
  });

  // console.log(dataWithChartname, avgs)
  return avgs
}

export const getCountinAttribute = (fullData, currentImage, currentAttribute) => {
  const dataWithChartname = fullData.filter((e) => e.chart_name == currentImage);
  const scoresSelected = dataWithChartname.map((e) => e[currentAttribute]);
  return [...Array(7).keys()].map((item, index) =>
    scoresSelected.filter(x => x == (item + 1)).length
  );
}

export const getWHYofAttributes = (fullData, currentImage, currentAttribute, currentScore) => {
  const dataWithChartname = fullData.filter((e) => e.chart_name == currentImage);
  const selectedWhy = dataWithChartname.map((e) => [e[currentAttribute], e[currentAttribute + "-why"]]);
  // console.log(currentAttribute, selectedWhy)
  const sorted = selectedWhy.sort((a, b) => {
    return a[0] - b[0];
  });
  return (currentScore != 0 ? sorted.filter((e) => e[0] == parseInt(currentScore)) : sorted).map((e) => <div>{e[0]}: {e[1]}</div>);
}
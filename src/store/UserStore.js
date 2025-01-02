import { create } from "zustand";
import Papa from 'papaparse';

export const TARGETS = ["Introduction", "Task 1: Absolute Score", "Task 2: Pairwise Comparison"]
export const SORTS_ABS = ["image", "int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const SORTS_PAIR = ["All", "int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const CATS = ["int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const CATS_FULL = ["Interest", "Memorability", "Trustworthiness", "Empathy", "Aesthetic Pleasure", "Intuitiveness", "Comfort"]
export const CATS_WHY = ["int-why", "mem-why", "tru-why", "emp-why", "aes-why", "itt-why", "cft-why"]
export const MODELS = ["Human", "GPT4o", "Llama3.2 Vision Instruct", "Sonnet 3.5 (1)", "Sonnet 3.5 (2)"]

export const UserStore = create((set, get) => ({
  // Target
  target: "Introduction",
  setTarget: (tar) => set({ target: tar }),

  
  // Absolute Score
  attributeAbs: "image",
  setAttributeAbs: (n) => set({ attributeAbs: n }),

  currentImage: "COVID-1",
  setCurrentImage: (img) => set({ currentImage: img }),

  currentFactor: "int",
  setCurrentFactor: (att) => set({ currentFactor: att }),

  currentScore: 4,
  setCurrentScore: (score) => set({ currentScore: score }),

  loaded: null,
  setLoaded: (file) => set({ loaded: file }),

  loadedMean: {},
  addLoadedMeanScore: (model, file) => set(state => ({
    loadedMean: {
      ...state.loadedMean,
      [model]: file
    }
  })),

  // Pairwise Comparison
  attributePair: "int",
  setAttributePair: (n) => set({ attributePair: n }),

  bin: 9,
  setBin: (b) => set({ bin: b }),

  // Model selection
  currentModelAbs: "Human",
  setCurrentModelAbs: (model) => set({ currentModelAbs: model }),

  currentModelPair: "GPT4o",
  setCurrentModelPair: (model) => set({ currentModelPair: model }),

  // Score data states
  sonnetScores1: null,
  sonnetScores2: null, 
  llamaScores: null,
  gpt4Scores: null,

  // Loading states
  isLoadingScores: false,
  loadError: null,

  // Setters
  setSonnetScores1: (scores) => set({ sonnetScores1: scores }),
  setSonnetScores2: (scores) => set({ sonnetScores2: scores }),
  setLlamaScores: (scores) => set({ llamaScores: scores }),
  setGpt4Scores: (scores) => set({ gpt4Scores: scores }),
  setIsLoadingScores: (loading) => set({ isLoadingScores: loading }),
  setLoadError: (error) => set({ loadError: error }),

  // Async loading functions
  loadScoreData: async () => {
    const store = get();
    store.setIsLoadingScores(true);
    store.setLoadError(null);

    try {
      // Load all score files in parallel
      const [sonnet1Data, sonnet2Data, llamaData, gpt4Data] = await Promise.all([
        fetch('https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/scores_sonnet_36_1.csv').then(res => res.text()),
        fetch('https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/scores_sonnet_36_2.csv').then(res => res.text()),
        fetch('https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/scores_llama_216.csv').then(res => res.text()),
        fetch('https://raw.githubusercontent.com/Chart2Emotion/Chart2Emotion.github.io/refs/heads/main/public/data/scores_GPT4o_36.csv').then(res => res.text())
      ]);

      // console.log(sonnet1Data, sonnet2Data, llamaData, gpt4Data);

      // Parse CSV data
      const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
          }, {});
        }).filter(row => Object.values(row).some(v => v));
      };

      // Set parsed data to store
      store.setSonnetScores1(parseCSV(sonnet1Data));
      console.log(store.sonnetScores1);
      store.setSonnetScores2(parseCSV(sonnet2Data));
      store.setLlamaScores(parseCSV(llamaData));
      store.setGpt4Scores(parseCSV(gpt4Data));

    } catch (error) {
      store.setLoadError(error.message);
      console.error('Error loading score data:', error);
    } finally {
      store.setIsLoadingScores(false);
    }
  },

  // Data loading functions
  loadData: async () => {
    const store = get();
    try {
      const response = await fetch('/data/240826_total_1296_0.csv');
      const csvText = await response.text();
      store.setLoaded(Papa.parse(csvText, { header: true }).data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },

  loadMeanScoreData: async () => {
    const models = {
      'GPT4o': 'GPT4o_36', 
      'Llama3.2 Vision Instruct': 'llama_216', 
      'Sonnet 3.5 (1)': 'sonnet_36_1', 
      'Sonnet 3.5 (2)': 'sonnet_36_2',
      'Human': 'Human'
    }
    const store = get();
    for (const model of MODELS) {
      try {
        const response = await fetch('/data/scores_'+models[model]+'_mean.csv');
        const csvText = await response.text();
        store.addLoadedMeanScore(model, Papa.parse(csvText, { header: true }).data);
      } catch (error) {
        console.error('Error loading mean score data:', error);
      }
    }
  },

  // Combined loading function
  loadAllData: async () => {
    const store = get();
    await Promise.all([
      store.loadData(),
      store.loadScoreData(),
      store.loadMeanScoreData()
    ]);
  },

  // Getter functions
  getAllScores: () => {
    const store = get();
    return {
      sonnet_1: store.sonnetScores1,
      sonnet_2: store.sonnetScores2,
      llama: store.llamaScores,
      gpt4: store.gpt4Scores
    };
  },

  getScoresByModel: (model) => {
    const store = get();
    switch(model) {
      case 'sonnet_1':
        return store.sonnetScores1;
      case 'sonnet_2':
        return store.sonnetScores2;
      case 'llama_32_11B':
        return store.llamaScores;
      case 'gpt-4o':
        return store.gpt4Scores;
      default:
        return null;
    }
  },

  // Helper function to check if all scores are loaded
  areScoresLoaded: () => {
    const store = get();
    return !!(
      store.sonnetScores1 && 
      store.sonnetScores2 && 
      store.llamaScores && 
      store.gpt4Scores
    );
  },
}));

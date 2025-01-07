import { create } from "zustand";
import Papa from 'papaparse';

export const TARGETS = ["Introduction", "Task 1: Absolute Score", "Task 2: Pairwise Comparison"]
export const SORTS_ABS = ["image", "int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const SORTS_PAIR = ["All", "int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const CATS = ["int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const CATS_FULL = ["Interest", "Memorability", "Trustworthiness", "Empathy", "Aesthetic Pleasure", "Intuitiveness", "Comfort"]
export const CATS_WHY = ["int-why", "mem-why", "tru-why", "emp-why", "aes-why", "itt-why", "cft-why"]
export const MODELS = ["Human", "GPT-4o", "Llama-3.2-Vision-Instruct", "Claude 3.5 Sonnet"]

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

  currentModelPair: "GPT-4o",
  setCurrentModelPair: (model) => set({ currentModelPair: model }),

  // Score data states
  claudeScores: null,
  llamaScores: null,
  gptScores: null,

  // Loading states
  isLoadingScores: false,
  loadError: null,

  // Setters
  setClaudeScores: (scores) => set({ claudeScores: scores }),
  setLlamaScores: (scores) => set({ llamaScores: scores }),
  setGptScores: (scores) => set({ gptScores: scores }),
  setIsLoadingScores: (loading) => set({ isLoadingScores: loading }),
  setLoadError: (error) => set({ loadError: error }),

  // Async loading functions
  loadScoreData: async () => {
    const store = get();
    store.setIsLoadingScores(true);
    store.setLoadError(null);

    try {
      // Load all score files in parallel
      const [claudeData, llamaData, gptData] = await Promise.all([
        fetch('https://raw.githubusercontent.com/Chart2Experience/Chart2Experience.github.io/refs/heads/main/public/data/scores_Claude_35.csv').then(res => res.text()),
        fetch('https://raw.githubusercontent.com/Chart2Experience/Chart2Experience.github.io/refs/heads/main/public/data/scores_Llama_32.csv').then(res => res.text()),
        fetch('https://raw.githubusercontent.com/Chart2Experience/Chart2Experience.github.io/refs/heads/main/public/data/scores_GPT_4o.csv').then(res => res.text())
      ]);

      // console.log(claudeData, llamaData, gptData);

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
      store.setClaudeScores(parseCSV(claudeData));
      store.setLlamaScores(parseCSV(llamaData));
      store.setGptScores(parseCSV(gptData));

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
      'GPT-4o': 'GPT_4o', 
      'Llama-3.2-Vision-Instruct': 'Llama_32', 
      'Claude 3.5 Sonnet': 'Claude_35', 
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

  // Helper function to check if all scores are loaded
  areScoresLoaded: () => {
    const store = get();
    return !!(
      store.claudeScores && 
      store.llamaScores && 
      store.gptScores
    );
  },
}));

import { computeIDF } from "./computeIdf";
import { computeTF } from "./computeTf";

export function computeTFIDFVector(text: string, corpus: string[][]): Map<string, number> {
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    const tfidf = new Map<string, number>();
    const uniqueTerms = Array.from(new Set(words));
    uniqueTerms.forEach(term => {
      const tf = computeTF(words, term);
      const idf = computeIDF(corpus, term);
      tfidf.set(term, tf * idf);
    });
    return tfidf;
  }
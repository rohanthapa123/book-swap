export function computeTF(words: string[], term: string): number {
    const termCount = words.filter(w => w === term).length;
    return termCount / words.length;
}
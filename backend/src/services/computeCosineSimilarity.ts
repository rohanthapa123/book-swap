export function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
    const allTerms = new Set([...vec1.keys(), ...vec2.keys()]);
    let dotProduct = 0, mag1 = 0, mag2 = 0;
    allTerms.forEach(term => {
        const val1 = vec1.get(term) || 0;
        const val2 = vec2.get(term) || 0;
        dotProduct += val1 * val2;
        mag1 += val1 ** 2;
        mag2 += val2 ** 2;
    });
    return mag1 && mag2 ? dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0;
}
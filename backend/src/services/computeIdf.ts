export function computeIDF(docs: string[][], term: string): number {
    const containingDocs = docs.filter(doc => doc.includes(term)).length;
    return Math.log((docs.length + 1) / (containingDocs + 1)) + 1;
}

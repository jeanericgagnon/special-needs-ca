/**
 * Checks if a keyword in a text is preceded by a negation term in the same clause/context.
 */
export function isNegated(text: string, keywordIndex: number): boolean {
  // Extract up to 30 characters before the keyword
  const precedingText = text.slice(Math.max(0, keywordIndex - 30), keywordIndex);
  
  // Split by clause-terminating punctuation (., ;, !, ?)
  const clauses = precedingText.split(/[.;!?]/);
  const lastClause = clauses[clauses.length - 1];
  
  // Tokenize the last clause into words
  const words = lastClause.trim().split(/\s+/).map(w => w.replace(/[",.?]/g, '').toLowerCase());
  
  // We only look at the last 4 words preceding the keyword to avoid distant negation matching
  const contextWords = words.slice(-4);
  
  const negationTerms = new Set([
    'no', 'not', 'never', 'none', 'without', 
    "doesn't", "don't", "isn't", "aren't", "won't", "can't", "cannot",
    'zero', 'prevent', 'avoid', 'free'
  ]);
  
  return contextWords.some(word => negationTerms.has(word));
}

/**
 * Scans the text for any of the given keywords, and returns true if at least one
 * keyword is found and is NOT negated.
 */
export function hasNonNegatedKeyword(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  for (const keyword of keywords) {
    let index = lowerText.indexOf(keyword);
    while (index !== -1) {
      if (!isNegated(lowerText, index)) {
        return true;
      }
      index = lowerText.indexOf(keyword, index + 1);
    }
  }
  return false;
}

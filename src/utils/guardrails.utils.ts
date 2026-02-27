export interface GuardrailResult {
  isValid: boolean;
  reason?: 'CHAR_LIMIT_EXCEEDED' | 'BANNED_WORD' | 'BANNED_PHRASE';
}

export const runGuardrails = (content: string, config: any): GuardrailResult => {
  
  // Character Limit Validation
  if (content.length > config.max_characters) {
    return { isValid: false, reason: 'CHAR_LIMIT_EXCEEDED' };
  }

  // Banned Word Validation (Case-insensitive)
  const bannedWords: string[] = config.banned_words || [];
  for (const word of bannedWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(content)) {
      return { isValid: false, reason: 'BANNED_WORD' };
    }
  }

  // Banned Phrase Validation
  const bannedPhrases: string[] = config.banned_phrases || [];
  for (const phrase of bannedPhrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      return { isValid: false, reason: 'BANNED_PHRASE' };
    }
  }

  return { isValid: true };
};
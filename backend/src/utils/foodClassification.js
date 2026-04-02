const NON_VEG_PATTERNS = [
  /\bchicken\b/i,
  /\bfish\b/i,
  /\begg\b/i,
  /\beggs\b/i,
  /\bmutton\b/i,
  /\bmeat\b/i,
  /\bbeef\b/i,
  /\bpork\b/i,
  /\blamb\b/i,
  /\bduck\b/i,
  /\bgoat\b/i,
  /\bprawn\b/i,
  /\bshrimp\b/i,
  /\bcrab\b/i,
  /\blobster\b/i,
  /\bkeema\b/i,
  /\bchorizo\b/i
];

function hasNonVegKeyword(value = '') {
  const text = String(value || '').trim();
  if (!text) return false;
  return NON_VEG_PATTERNS.some((pattern) => pattern.test(text));
}

export function normalizeDietType(value, name = '', category = '') {
  const explicit = String(value || '').trim().toLowerCase();
  if (explicit === 'veg' || explicit === 'nonveg') {
    return explicit;
  }

  const combinedText = `${name} ${category}`;
  return hasNonVegKeyword(combinedText) ? 'nonveg' : 'veg';
}

export function classifyDietType(name, category, explicitValue) {
  return normalizeDietType(explicitValue, name, category);
}

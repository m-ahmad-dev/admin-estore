export function normalizeAttributeRules(attributes = []) {
  if (!Array.isArray(attributes)) return [];
  return attributes
    .filter(Boolean)
    .map((attribute) => ({
      name: String(attribute.name ?? "").trim(),
      type: attribute.type ?? "string",
      label: attribute.label || attribute.name || "Attribute",
      required: attribute.required !== false,
      options: Array.isArray(attribute.options) ? attribute.options : [],
    }))
    .filter((attribute) => attribute.name);
}

export function createEmptyAttributes(rules = []) {
  return rules.reduce((result, rule) => {
    result[rule.name] = "";
    return result;
  }, {});
}

export function normalizeAttributeValue(rule, value) {
  if (rule.type === "number") {
    if (value === "" || value === null) return "";
    return Number(value);
  }
  if (rule.type === "boolean") return Boolean(value);
  return value ?? "";
}

export function cleanVariantAttributes(attributes = {}, rules = []) {
  const result = {};
  for (const rule of rules) {
    const value = attributes?.[rule.name];
    if (value === undefined || value === null || value === "") continue;
    result[rule.name] = normalizeAttributeValue(rule, value);
  }
  return result;
}

export function attributesEqual(first = {}, second = {}) {
  return JSON.stringify(first) === JSON.stringify(second);
}

export function formatVariantAttributes(attributes = {}) {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" • ");
}

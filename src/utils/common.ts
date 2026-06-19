export function trunc(str: string, length: number = 5, fill: string = "..") {
  return str.slice(0, length) + fill;
}

// Block non-numeric keys (letters, scientific notation, etc.) on number inputs.
// Allows digits, a single decimal point, a leading sign, and control keys.
export function preventNonNumericInput(event: KeyboardEvent) {
  // Let control/navigation keys and shortcuts through.
  if (event.key.length > 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  if (!/[0-9.+-]/.test(event.key)) {
    event.preventDefault();
  }
}

export function generateSessionId() {
  return 'session-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

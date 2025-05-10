export const sanitizeInput = (input) => {
  if (!input) return "";
  // Remove script tags and other potentially malicious content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "");
};

// src/utils/security.js
export class RateLimiter {
  constructor(maxAttempts = 5, timeWindow = 60000) {
    this.attempts = {};
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
  }

  checkLimit(id) {
    const now = Date.now();
    if (!this.attempts[id]) {
      this.attempts[id] = { count: 1, timestamp: now };
      return true;
    }

    const attempt = this.attempts[id];
    if (now - attempt.timestamp > this.timeWindow) {
      attempt.count = 1;
      attempt.timestamp = now;
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }
}

// Implementation in AuthContext.js
const loginRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

const login = (email, password) => {
  if (!loginRateLimiter.checkLimit(email)) {
    throw new Error("Too many login attempts. Please try again later.");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

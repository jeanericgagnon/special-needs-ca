/**
 * Promisified sleep function.
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Stateful RateLimiter class to manage crawler delays, random jitter, and backoff.
 */
export class RateLimiter {
  /**
   * @param {Object} options
   * @param {number} options.baseDelay - Baseline delay in ms (default: 2000)
   * @param {number} options.maxJitter - Maximum random jitter in ms (default: 3000)
   * @param {number} options.backoffFactor - Multiplier for exponential backoff (default: 2)
   * @param {number} options.maxBackoff - Maximum delay in ms for backoff (default: 60000)
   */
  constructor(options = {}) {
    this.baseDelay = this._validate(options.baseDelay, 2000);
    this.maxJitter = this._validate(options.maxJitter, 3000);
    this.backoffFactor = this._validate(options.backoffFactor, 2);
    this.maxBackoff = this._validate(options.maxBackoff, 60000);
    this.backoffLevel = 0;
  }

  /**
   * Helper to validate and normalize numeric inputs.
   * @private
   * @param {*} value - The input to validate
   * @param {number} defaultValue - Default fallback
   * @returns {number} Validated, non-negative, finite number
   */
  _validate(value, defaultValue) {
    if (value === undefined || value === null || typeof value === 'object' || Array.isArray(value) || typeof value === 'boolean') {
      return defaultValue;
    }
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) {
      return defaultValue;
    }
    return num;
  }

  /**
   * Calculates the delay based on baseline, current backoff level, and random jitter.
   * @returns {number} Delay in milliseconds
   */
  getDelay() {
    const backoffMultiplier = Math.pow(this.backoffFactor, this.backoffLevel);
    const baseBackoffDelay = Math.min(this.baseDelay * backoffMultiplier, this.maxBackoff);
    const jitter = Math.random() * this.maxJitter;
    return baseBackoffDelay + jitter;
  }

  /**
   * Throttles the crawler execution for a calculated delay.
   * @returns {Promise<number>} The milliseconds actually slept
   */
  async throttle() {
    const delay = this.getDelay();
    await sleep(delay);
    return delay;
  }

  /**
   * Increments the backoff level to increase delay on next check.
   */
  backoff() {
    const currentBaseDelay = this.baseDelay * Math.pow(this.backoffFactor, this.backoffLevel);
    if (currentBaseDelay < this.maxBackoff && this.backoffLevel < 1000) {
      this.backoffLevel += 1;
    }
  }

  /**
   * Resets the backoff level back to zero (normal speed).
   */
  reset() {
    this.backoffLevel = 0;
  }
}

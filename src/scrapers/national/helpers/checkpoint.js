import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * CheckpointManager manages saving and loading scraper checkpoint state files.
 */
export class CheckpointManager {
  /**
   * @param {string} scraperName - Name of the scraper (e.g. 'copaa', 'wrightslaw', 'justia')
   * @param {string} state - 2-letter state code (e.g. 'NY', 'TX')
   * @param {Object} options
   * @param {string} options.checkpointDir - Custom folder path to store checkpoint JSONs
   */
  constructor(scraperName, state, options = {}) {
    if (scraperName === undefined || scraperName === null || state === undefined || state === null || scraperName === '' || state === '') {
      throw new Error('CheckpointManager requires both scraperName and state.');
    }
    if (typeof scraperName !== 'string') {
      throw new TypeError('scraperName must be a string.');
    }
    if (typeof state !== 'string') {
      throw new TypeError('state must be a string.');
    }
    if (scraperName.trim() === '' || state.trim() === '') {
      throw new Error('CheckpointManager requires both scraperName and state.');
    }

    this.scraperName = scraperName.toLowerCase();
    this.state = state.toUpperCase();

    // Default to src/scrapers/national/data/checkpoints/ (resolved relative to this module)
    const defaultDir = path.resolve(__dirname, '../data/checkpoints');
    this.checkpointDir = options.checkpointDir || defaultDir;
    this.filePath = path.join(this.checkpointDir, `${this.scraperName}_${this.state}.json`);
  }

  /**
   * Checks whether the checkpoint file exists.
   * @returns {boolean}
   */
  exists() {
    return fs.existsSync(this.filePath);
  }

  /**
   * Loads the checkpoint JSON from the filesystem.
   * @returns {Object|null} The parsed JSON object or null if it does not exist
   */
  load() {
    try {
      if (this.exists()) {
        const rawContent = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(rawContent);
      }
    } catch (error) {
      console.error(`Failed to load checkpoint file at ${this.filePath}:`, error);
    }
    return null;
  }

  /**
   * Saves the provided checkpoint state data.
   * @param {Object} data - State key-value pairs (e.g. { lastProcessedPage, completed, metadata })
   */
  save(data = {}) {
    if (!isPlainObject(data)) {
      throw new TypeError('save() expects a plain object.');
    }

    try {
      if (!fs.existsSync(this.checkpointDir)) {
        fs.mkdirSync(this.checkpointDir, { recursive: true });
      }

      const payload = {
        scraper: this.scraperName,
        state: this.state,
        updatedAt: new Date().toISOString(),
        lastProcessedPage: null,
        completed: false,
        metadata: {},
        ...data
      };

      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (error) {
      console.error(`Failed to save checkpoint file at ${this.filePath}:`, error);
      throw error;
    }
  }

  /**
   * Clears (deletes) the checkpoint file.
   */
  clear() {
    try {
      if (this.exists()) {
        fs.unlinkSync(this.filePath);
      }
    } catch (error) {
      console.error(`Failed to delete checkpoint file at ${this.filePath}:`, error);
    }
  }
}

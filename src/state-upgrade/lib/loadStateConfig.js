import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadStateConfig(stateId) {
  const normalizedId = stateId.toLowerCase();
  const configPath = path.resolve(__dirname, `../../../data/state-upgrades/${normalizedId}/state_config.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(`State config not found at: ${configPath}. Make sure to scaffold data/state-upgrades/${normalizedId}/state_config.json.`);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config;
}

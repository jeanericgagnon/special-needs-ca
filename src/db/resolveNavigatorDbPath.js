import fs from 'fs';
import path from 'path';

export function resolveNavigatorDbPath(repoRoot) {
  const candidates = [
    path.join(repoRoot, 'ca_disability_navigator.db'),
    path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

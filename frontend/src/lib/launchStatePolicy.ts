import fs from 'fs';
import path from 'path';

export type LaunchSurface =
  | 'state-hub'
  | 'programs-index'
  | 'program-guide'
  | 'state-counties-hub'
  | 'condition-hub'
  | 'county-hub'
  | 'county-condition'
  | 'school-district'
  | 'city';

type PartialStatePolicyRow = {
  stateId: string;
  launchBehavior: 'partial_gated';
  allowedSurfaces: LaunchSurface[];
  suppressedSurfaces: LaunchSurface[];
  suppressedFamilies: string[];
  verifiedStatewideFamilies: string[];
  unavailableMessage: string;
};

type PartialStatePolicyData = {
  generatedAt: string;
  launchReadyCompleteStateCount: number;
  blockedStateCount: number;
  states: PartialStatePolicyRow[];
};

let partialStatePolicy: PartialStatePolicyData | null = null;

if (typeof window === 'undefined') {
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), 'data/generated/launch_partial_state_policy_v1.json'),
      path.resolve(process.cwd(), '../data/generated/launch_partial_state_policy_v1.json'),
    ];

    for (const candidatePath of candidatePaths) {
      if (fs.existsSync(candidatePath)) {
        partialStatePolicy = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
        break;
      }
    }
  } catch (error) {
    console.error('Failed to load launch partial-state policy:', error);
  }
}

export function getPartialStatePolicy(stateId: string): PartialStatePolicyRow | null {
  if (!stateId || !partialStatePolicy?.states) return null;
  return partialStatePolicy.states.find((row) => row.stateId === stateId.toLowerCase()) || null;
}

export function isPartialState(stateId: string): boolean {
  return getPartialStatePolicy(stateId) !== null;
}

export function isLaunchSurfaceSuppressed(stateId: string, surface: LaunchSurface): boolean {
  const policy = getPartialStatePolicy(stateId);
  if (!policy) return false;
  return policy.suppressedSurfaces.includes(surface);
}

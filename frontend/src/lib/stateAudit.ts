import fs from 'fs';
import path from 'path';

interface AuditState {
  stateId: string;
  classification: string;
  indexSafe: boolean;
}

interface AuditData {
  states: AuditState[];
}

interface PriorityQueueState {
  state: string;
  classification: string;
  index_safe: boolean;
  primary_gap_reason?: string | null;
}

interface RuntimeLaunchState {
  stateId: string;
  runtimeIndexSafe: boolean;
}

interface RuntimeLaunchRegistry {
  states: RuntimeLaunchState[];
}

let auditData: AuditData | null = null;
const priorityQueueData: PriorityQueueState[] = [];
let runtimeLaunchRegistry: RuntimeLaunchRegistry | null = null;

function resolveGeneratedArtifact(filename: string): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'data/generated', filename),
    path.resolve(process.cwd(), 'frontend/../data/generated', filename),
    path.resolve(process.cwd(), '../data/generated', filename),
    path.resolve(process.cwd(), '../../data/generated', filename),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

if (typeof window === 'undefined') {
  try {
    const auditPath = resolveGeneratedArtifact('all_state_california_grade_audit_v3.json');
    if (auditPath) {
      auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }

    const pqPath = resolveGeneratedArtifact('all_state_priority_queue_v3.jsonl');
    if (pqPath) {
      const lines = fs.readFileSync(pqPath, 'utf8').split('\n');
      for (const line of lines) {
        if (line.trim()) {
          priorityQueueData.push(JSON.parse(line));
        }
      }
    }

    const runtimeRegistryPath = resolveGeneratedArtifact('runtime_launch_registry_v1.json');
    if (runtimeRegistryPath) {
      runtimeLaunchRegistry = JSON.parse(fs.readFileSync(runtimeRegistryPath, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to load state audit data:', err);
  }
}

export function stateAuditStatus(stateId: string): { classification: string; indexSafe: boolean } | null {
  if (!stateId) return null;
  const normalized = stateId.toLowerCase().trim();

  if (!auditData || !Array.isArray(auditData.states) || priorityQueueData.length === 0) {
    return null;
  }

  const stateObj = auditData.states.find((s) => s && s.stateId === normalized);
  const pqObj = priorityQueueData.find((s) => s && s.state === normalized);

  if (!stateObj || !pqObj) return null;

  const isConsistent =
    stateObj.classification === pqObj.classification &&
    stateObj.indexSafe === pqObj.index_safe;
  if (!isConsistent) {
    console.error(
      `Audit data inconsistency for ${normalized}: JSON says classification=${stateObj.classification}, indexSafe=${stateObj.indexSafe}. PQ says classification=${pqObj.classification}, index_safe=${pqObj.index_safe}`
    );
    return null;
  }

  return {
    classification: stateObj.classification,
    indexSafe: stateObj.indexSafe,
  };
}

export function stateGapReason(stateId: string): string | null {
  if (!stateId) return null;
  const normalized = stateId.toLowerCase().trim();
  const pqObj = priorityQueueData.find((s) => s && s.state === normalized);
  return pqObj ? (pqObj.primary_gap_reason || null) : null;
}

export function stateRuntimeLaunchStatus(stateId: string): { runtimeIndexSafe: boolean } | null {
  if (!stateId) return null;
  const normalized = stateId.toLowerCase().trim();
  if (!runtimeLaunchRegistry || !Array.isArray(runtimeLaunchRegistry.states)) {
    return null;
  }

  const row = runtimeLaunchRegistry.states.find((s) => s && s.stateId === normalized);
  if (!row) return null;

  return {
    runtimeIndexSafe: row.runtimeIndexSafe === true,
  };
}

export function getEligibleStatesFromAudit(): string[] {
  if (!auditData || !Array.isArray(auditData.states) || priorityQueueData.length === 0) {
    return [];
  }
  return auditData.states
    .filter((s) => {
      const status = stateAuditStatus(s.stateId);
      return status !== null && status.classification === 'COMPLETE' && status.indexSafe === true;
    })
    .map((s) => s.stateId);
}

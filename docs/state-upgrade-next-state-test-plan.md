# State-Upgrade Test Plan: New York (NY) Dry-Run

This document outlines the command sequence, validation checkpoints, and expected data modeling for the upcoming New York state-upgrade dry-run.

---

## 1. Dry-Run Command Sequence
Execute the New York research mode to generate baseline reports and verify baseline metrics:
```bash
node src/state-upgrade/run_state_upgrade.js --state new-york --mode research
```

---

## 2. Expected Outputs
Upon successful completion of the research mode, the following files must be created:
*   `docs/state-upgrades/new-york/00-baseline.md`
*   `docs/state-upgrades/new-york/01-resource-truth-map.md`
*   `docs/state-upgrades/new-york/02-gap-analysis.md`
*   `docs/state-upgrades/new-york/03-pull-plan.md`

---

## 3. Stop Gates & Audits

### Stop Gate 1: Baseline Audit (Post-Research)
*   **Verification:** Ensure New York baseline readiness score is calculated based on New York's 62 counties, and fallback counts are retrieved via `%-ny` suffix checks (rather than Florida's `%-fl`).
*   **Safety Check:** Confirm that no write transactions were executed against `ca_disability_navigator.db` (file timestamps must remain identical to pre-execution).

---

## 4. Scaffold Configuration for New York

To enable the dry-run, we will create the configuration file `data/state-upgrades/new-york/state_config.json` with the following parameters:
*   `state_id`: `"new-york"`
*   `state_slug`: `"new-york"`
*   `state_name`: `"New York"`
*   `state_code`: `"NY"`
*   `county_id_suffix`: `"-ny"`
*   `program_id_prefix`: `"ny-"`
*   `expected_counties`: 62
*   `phase_sequence`: `["benefits_hhs", "dd_idd", "early_intervention"]`
*   `validation_expectations`: `{"benefits_hhs_count": 0, "dd_idd_count": 0, "early_intervention_count": 0}`

# Source Discovery Lessons Learned Workflow

This framework details the lessons-learned loop, verification processes, and feedback cycles to upgrade state data models after each crawling wave.

## 1. Wave Retrospective Cycle

Every wave requires updating the lessons-learned documentation to capture:
- Common selector patterns discovered across agencies.
- Domain blocks or robots.txt changes.
- Address and telephone normalization failures.
- Auto-promotion criteria tweaks.

## 2. Playbook Action Items Checklist

- [ ] Verify all scrapers output strictly to staging tables first.
- [ ] Never mark scraped data as `human_verified` automatically.
- [ ] Cross-check crawled county identifiers with the central `counties` table.
- [ ] Log warnings if a state agency changes its domain structure (e.g. from .state.tx.us to .texas.gov).

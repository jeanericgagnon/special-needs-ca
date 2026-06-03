# California Special Needs Navigator: Case Command Center & Resource Directories

A professional-grade, data-driven web application designed to help California families and caregivers navigate complex state disability programs, special education inclusion frameworks, and local advocate support directories.

---

## 🏗️ Repository Architecture

This repository is structured as a monorepo containing a production Next.js frontend application, automated Playwright crawlers, and database synchronization pipelines.

```
├── frontend/                     # Production Next.js App Workspace
│   ├── src/app/                  # App Router pages and API routes
│   │   ├── dashboard/            # Care Roadmap Case Command Center
│   │   ├── sitemaps/             # Dynamic quality-controlled XML sitemaps
│   │   └── benefits/             # Leaf directories for diagnoses & counties
│   ├── src/lib/                  # Shared database handlers, auth, and data assets
│   ├── public/                   # Static icons and assets
│   ├── next.config.ts            # Production Next.js configuration
│   └── package.json              # Next.js dependencies & scripts
│
├── src/                          # Scraper and Data Seeding Engine
│   ├── scrapers/                 # Playwright crawler definitions
│   │   ├── advocate_scraper.js   # Wrightslaw and OAH due process list crawlers
│   │   └── copaa_scraper.js      # COPAA member directory scraper
│   ├── db/                       # Database seeding, schema, and migrations
│   └── engine/                   # Rules matching and prioritization definitions
│
├── prototype_quarantine/         # Archived Vite/Express prototype files (Quarantined)
├── package.json                  # Root monorepo scripts & dependencies
└── README.md                     # This documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### 2. Development Setup

To run the Next.js production frontend workspace locally:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create a .env.local file:
# JWT_SECRET=your-random-secure-secret-string

# Start the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Data Pipelines & Scrapers
The crawling pipeline runs from the root workspace using Playwright:
```bash
# Install root dependencies
npm install

# Run OAH due process advocates scraper
npm run crawl:advocates

# Run Wrightslaw Yellow Pages scraper
npm run crawl:wrightslaw
```

---

## 🛡️ Trust & Security Hardening

- **Stateless HMAC-SHA256 Auth**: User sessions are handled via stateless JSON Web Tokens (JWT) stored in HTTP-Only, Secure, SameSite=Strict cookies.
- **Fail-Closed Strategy**: The application forces runtime validation on `JWT_SECRET`. If the environment variable is not defined, the application fails closed immediately on session operations to prevent misconfiguration.
- **Password Hardening**: The registration action enforces a strict minimum password length of **10 characters** to protect sensitive family care data.
- **Legal Compliance**: Standard disclaimers, assumptions disclosures, and human-verified dates are displayed across all calculator widgets and benefits leaf directories.

---

## 📈 SEO & Sitemap Thresholds

Leaf pages (`/benefits/[diagnosis]/[geography]`) are subject to a strict database-backed **Quality Index Threshold** before being indexed in dynamic sitemaps:
- The county must have active Regional Center contacts.
- The county must have active IHSS/Social Services offices.
- The county must have at least one school district or SELPA record.
- The diagnosis must have at least one source-backed program match.
This prevents search engines from indexing thin, duplicate, or blank boilerplate templates.

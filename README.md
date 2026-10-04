# 🚀 Advanced Playwright Test Automation Framework

A production-grade, enterprise-ready end-to-end test automation framework built with **Playwright** and **TypeScript**.

This framework demonstrates modern quality engineering practices across **UI End-to-End Testing**, **REST API Testing**, **Automated Accessibility (A11y) Auditing**, **Visual Regression Comparison**, **Custom Test Fixtures (Dependency Injection)**, and **GitHub Actions CI/CD**.

---

## 📑 Table of Contents

1. [Tech Stack & Capabilities](#-tech-stack--capabilities)
2. [Project Architecture](#-project-architecture)
3. [Folder Structure](#-folder-structure)
4. [Custom Fixtures & Dependency Injection](#-custom-fixtures--dependency-injection)
5. [Page Object Model (POM)](#-page-object-model-pom)
6. [API Testing Architecture](#-api-testing-architecture)
7. [Visual Regression Testing](#-visual-regression-testing)
8. [Accessibility (A11y) Testing with Axe-core](#-accessibility-a11y-testing-with-axe-core)
9. [Reporting & Artifacts](#-reporting--artifacts)
10. [GitHub Actions CI/CD Pipeline](#-github-actions-cicd-pipeline)
11. [Getting Started & Test Execution](#-getting-started--test-execution)

---

## 🛠️ Tech Stack & Capabilities

* **Core Engine:** [Playwright Test](https://playwright.dev/) `v1.58+`
* **Language:** TypeScript `5.4+` (Strict Type Safety)
* **Design Pattern:** Page Object Model (POM) + Component Object Pattern
* **Dependency Injection:** Custom Playwright Test Fixtures (`test.extend`)
* **API Testing:** Playwright native `APIRequestContext` with custom `ApiClient` wrapper
* **Accessibility (A11y):** `@axe-core/playwright` scanning against WCAG 2.0 / 2.1 Level AA standards
* **Visual Testing:** Native Playwright snapshot comparison (`toHaveScreenshot()`) with pixel ratio tolerances
* **Reporting:** Playwright HTML Reporter, List Reporter, JSON Reporter, auto-attached screenshots, traces, and video recordings on failure
* **CI/CD:** GitHub Actions workflow with caching, dependency installation, headless cross-browser test runner, and report artifact uploads

---

## 🏗️ Project Architecture

```
                  ┌────────────────────────────────────────┐
                  │       Playwright Test Runner           │
                  └───────────────────┬────────────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               │                                             │
    ┌──────────▼──────────┐                       ┌──────────▼──────────┐
    │   Custom Fixtures   │                       │  playwright.config  │
    │  (Dependency Inj.)  │                       │   (Multi-Project)   │
    └──────────┬──────────┘                       └──────────┬──────────┘
               │                                             │
      ┌────────┼────────────────┬───────────────┐            ├─ ui-chromium
      │        │                │               │            ├─ api
┌─────▼────┐ ┌─▼─────────┐ ┌────▼───────┐ ┌─────▼───────┐    ├─ accessibility
│Page Obj. │ │Api Client │ │A11y Scanner│ │ Visual Comp.│    └─ visual
│(UI Tests)│ │(REST API) │ │(WCAG Rules)│ │ (Snapshots) │
└──────────┘ └───────────┘ └────────────┘ └─────────────┘
```

---

## 📁 Folder Structure

```
advanced-playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD pipeline
├── data/
│   ├── test-data.json             # UI test credentials, selectors, expectations
│   └── api-payloads.json          # REST API mock payloads and test fixtures
├── fixtures/
│   └── base-test.ts               # Custom Playwright fixtures (Dependency Injection)
├── pages/
│   ├── base.page.ts               # Base page with reusable methods
│   ├── login.page.ts              # Login page object
│   ├── inventory.page.ts          # Products inventory & cart operations
│   ├── cart.page.ts               # Shopping cart page object
│   └── checkout.page.ts           # Checkout steps & order completion
├── utils/
│   ├── api-client.ts              # Playwright APIRequestContext REST wrapper
│   └── a11y-helper.ts             # AxeBuilder WCAG scanner helper
├── tests/
│   ├── ui/
│   │   ├── auth.spec.ts           # Authentication & login validation tests
│   │   ├── inventory.spec.ts      # Product filtering, sorting, cart badges
│   │   └── checkout.spec.ts       # Full E2E purchase & confirmation flow
│   ├── api/
│   │   ├── users-api.spec.ts      # REST API CRUD operations (GET, POST, PUT, DELETE)
│   │   └── auth-api.spec.ts       # Authentication tokens & error responses
│   ├── visual/
│   │   └── visual-regression.spec.ts # Page and component level visual snapshots
│   └── accessibility/
│       └── a11y.spec.ts           # Automated WCAG 2.1 AA audits using Axe-core
├── playwright.config.ts           # Master configuration with dedicated projects
├── package.json                   # Dependencies, scripts, and package metadata
├── tsconfig.json                  # TypeScript compiler settings & path aliases
└── README.md                      # Comprehensive documentation
```

---

## 💉 Custom Fixtures & Dependency Injection

### Why Fixtures?
In traditional test frameworks, tests must repeatedly instantiate Page Objects and utilities:
```ts
// ❌ Traditional / Boilerplate Approach
test('my test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  await loginPage.goto();
  ...
});
```

With **Playwright Custom Fixtures**, dependencies are injected directly into the test arguments:
```ts
// ✅ Modern Playwright Fixture Approach
test('my test', async ({ authenticatedUserPage, cartPage, checkoutPage }) => {
  await authenticatedUserPage.addItemToCart('Sauce Labs Backpack');
  await authenticatedUserPage.goToCart();
  await cartPage.proceedToCheckout();
  ...
});
```

### Features implemented in `fixtures/base-test.ts`:
1. **Page Object Fixtures:** `loginPage`, `inventoryPage`, `cartPage`, `checkoutPage` are automatically created per test context.
2. **API Client Fixture:** `apiClient` wraps Playwright's `APIRequestContext` for frictionless API testing.
3. **A11y Helper Fixture:** `a11yHelper` provides easy access to Axe-core accessibility scans.
4. **Composed Fixture (`authenticatedUserPage`):** Automatically navigates, completes login, and delivers the authenticated `InventoryPage` ready for testing.

---

## 🏛️ Page Object Model (POM)

The framework strictly adheres to the **Page Object Model**:
* **Encapsulation:** Locators are defined as `readonly` class properties using user-facing selectors (`[data-test="..."]`).
* **Web-First Assertions:** Methods avoid brittle manual sleep calls (`page.waitForTimeout`) and leverage Playwright's automatic actionability checks (visible, enabled, stable).
* **DRY & Maintainable:** Common actions (navigation, page titles, wait states) reside in `BasePage`.

---

## 🌐 API Testing Architecture

API tests run independently of the browser for maximum speed:
* **Endpoint Validation:** Tests CRUD operations (`GET`, `POST`, `PUT`, `DELETE`).
* **Status Code Checks:** Asserts HTTP status codes (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).
* **Payload & Schema Verification:** Validates response bodies, JSON properties, data types, and timestamps.
* **Authentication:** Tests token generation via `/login` endpoint and error responses for invalid inputs.

---

## 👁️ Visual Regression Testing

Playwright's visual comparison captures screenshots of the browser viewport or specific components and compares them pixel-by-pixel against reference baselines:
* **Tolerance:** `maxDiffPixelRatio: 0.05` allows small rendering variations across OS environments.
* **Animation Control:** `animations: 'disabled'` eliminates flaky differences caused by CSS transitions.
* **Scope:**
  - Full-page baseline comparison (`login-page.png`).
  - Component-level baseline comparison (`credentials-box.png`, `inventory-header.png`).
* **Updating Snapshots:** Run `npm run test:visual:update` to generate or update reference images.

---

## ♿ Accessibility (A11y) Testing with Axe-core

Accessibility tests ensure the web application is inclusive and adheres to international web standards:
* **Standards Enforced:** WCAG 2.0 Level AA, WCAG 2.1 Level AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`).
* **Engine:** `@axe-core/playwright`.
* **Zero Critical Violations Policy:** Audits scan the DOM and assert that 0 critical or serious violations exist.
* **Granular Scoping:** Scans can audit the entire page or specific containers (e.g. `#root`, `.inventory_container`).

---

## 📊 Reporting & Artifacts

The framework produces multi-format test reports:
1. **HTML Report:** Interactive report showing total passed/failed tests, durations, step-by-step logs, failure screenshots, video recordings, and Playwright trace files.
2. **List Reporter:** Clean console output showing live test progress in the terminal.
3. **JSON Reporter:** Machine-readable `test-results/results.json` output for custom CI dashboards.
4. **Trace Viewer:** Retains full execution traces on retries to inspect network requests, DOM snapshots, and console logs.

---

## 🔄 GitHub Actions CI/CD Pipeline

The workflow in `.github/workflows/playwright.yml`:
* **Triggers:** Automatically runs on every `push` and `pull_request` to `main`/`master`, or via manual `workflow_dispatch`.
* **Environment:** Ubuntu Linux runner (`ubuntu-latest`) with Node.js 20.
* **Smart Caching:** Caches `~/.npm` and `~/.cache/ms-playwright` browser binaries based on the installed Playwright version to accelerate builds.
* **Execution:** Runs all 23 tests headlessly in parallel.
* **Artifact Archival:** Automatically uploads the `playwright-report/` artifact retained for 30 days.

---

## 🚀 Getting Started & Test Execution

### 1. Prerequisites
* **Node.js**: v18 or later
* **npm**: v9 or later

### 2. Installation
```bash
git clone <repository-url>
cd advanced-playwright-framework
npm install
npx playwright install --with-deps chromium
```

### 3. Execution Commands
| Command | Description |
| :--- | :--- |
| `npm test` | Runs the entire test suite (all projects) |
| `npm run test:ui` | Runs UI tests (Authentication, Inventory, Checkout) |
| `npm run test:api` | Runs REST API tests (CRUD, Auth) |
| `npm run test:a11y` | Runs Accessibility tests (WCAG 2.1 AA) |
| `npm run test:visual` | Runs Visual Regression comparison tests |
| `npm run test:visual:update` | Updates baseline visual snapshots |
| `npm run test:headed` | Runs tests in headed browser mode |
| `npm run test:report` | Opens the interactive HTML test report |

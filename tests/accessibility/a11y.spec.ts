import { test, expect } from '../../fixtures/base-test';

test.describe('Accessibility (A11y) - WCAG 2.1 Level AA Compliance', () => {
  test('TC-A11Y-01: Login page should adhere to WCAG accessibility standards with no critical violations', async ({
    page,
    loginPage,
    a11yHelper,
  }) => {
    await loginPage.goto();

    // Perform accessibility scan scoped to login container
    const audit = await a11yHelper.scanPage(page, {
      scopeSelector: '#root',
    });

    // Check for critical and serious impact violations
    const criticalViolations = audit.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.warn('A11y Violations Found:\n' + a11yHelper.formatViolationSummary(criticalViolations));
    }

    // Assert zero critical or serious accessibility regressions
    expect(
      criticalViolations,
      `Expected 0 critical/serious a11y violations, but found ${criticalViolations.length}`
    ).toHaveLength(0);
  });

  test('TC-A11Y-02: Inventory catalog page should maintain accessible structure and navigation', async ({
    page,
    authenticatedUserPage,
    a11yHelper,
  }) => {
    // Inventory page is already loaded via composed fixture
    const audit = await a11yHelper.scanPage(page, {
      scopeSelector: '.inventory_container',
    });

    const criticalViolations = audit.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(
      criticalViolations,
      `Expected 0 critical/serious a11y violations on inventory, but found ${criticalViolations.length}`
    ).toHaveLength(0);
  });
});

import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export interface AccessibilityAuditOptions {
  includedTags?: string[];
  excludedRules?: string[];
  scopeSelector?: string;
}

export interface ViolationReport {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodesCount: number;
}

/**
 * A11yHelper provides a unified API for running automated accessibility
 * scans using Axe-core with WCAG 2.1 Level AA compliance rules.
 */
export class A11yHelper {
  static async scanPage(
    page: Page,
    options: AccessibilityAuditOptions = {}
  ): Promise<{ violations: ViolationReport[]; pass: boolean }> {
    let builder = new AxeBuilder({ page });

    // Default to WCAG 2.0 / 2.1 AA standards
    const tags = options.includedTags || ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
    builder = builder.withTags(tags);

    if (options.excludedRules && options.excludedRules.length > 0) {
      builder = builder.disableRules(options.excludedRules);
    }

    if (options.scopeSelector) {
      builder = builder.include(options.scopeSelector);
    }

    const results = await builder.analyze();

    const formattedViolations: ViolationReport[] = results.violations.map(v => ({
      id: v.id,
      impact: v.impact || 'unknown',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodesCount: v.nodes.length,
    }));

    return {
      violations: formattedViolations,
      pass: formattedViolations.length === 0,
    };
  }

  static formatViolationSummary(violations: ViolationReport[]): string {
    if (violations.length === 0) {
      return 'No accessibility violations detected.';
    }
    return violations
      .map(
        (v, i) =>
          `[${i + 1}] Rule: "${v.id}" (Impact: ${v.impact})\n    Description: ${v.description}\n    Affected Elements: ${v.nodesCount}\n    Guide: ${v.helpUrl}`
      )
      .join('\n\n');
  }
}

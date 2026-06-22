import { expect } from '@playwright/test';

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async gotoSection(label) {
    await this.page.goto('http://localhost:5173/');
    await this.page.getByRole('button', { name: label }).click();
    // SPA navigation: wait for the section heading to appear to ensure content rendered
    await this.page.getByRole('heading', { name: label, exact: true }).waitFor({ state: 'visible', timeout: 15000 });
  }

  rowByText(text) {
    return this.page.getByRole('row').filter({ hasText: text }).last();
  }

  async expectRowVisible(text) {
    await expect(this.rowByText(text)).toBeVisible();
  }

  async expectRowContains(text, content) {
    await expect(this.rowByText(text)).toContainText(content);
  }
}

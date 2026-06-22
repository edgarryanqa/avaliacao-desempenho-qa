import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AvaliacoesPage extends BasePage {
  constructor(page) {
    super(page);
    // target the select inside the "Colaborador atual (impersonação)" panel
    const heading = page.getByRole('heading', { name: 'Colaborador atual (impersonação)', exact: true });
    this.selectColaborador = page.locator('div.panel', { has: heading }).locator('select').first();
    this.btnEnviar = page.getByRole('button', { name: /Enviar respostas/i });
  }

  async goto() {
    await this.gotoSection('Responder avaliações');
    // Wait for the panel heading (client render) then for the select to be visible
    const heading = this.page.getByRole('heading', { name: 'Colaborador atual (impersonação)', exact: true });
    await heading.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForLoadState('networkidle');
    await this.selectColaborador.waitFor({ state: 'visible', timeout: 30000 });
    // Wait until options were populated (at least the placeholder + one employee)
    try {
      await this.page.waitForFunction((sel) => sel && sel.options && sel.options.length > 1, this.selectColaborador, { timeout: 15000 });
    } catch (e) {
      // fallback: let selection attempt handle missing options and capture screenshot
    }
  }

  async selecionarColaborador(nome) {
    await this.selectColaborador.waitFor({ state: 'attached', timeout: 15000 });
    // ensure there is at least one real option (beyond placeholder)
    const optsCount = await this.selectColaborador.evaluate((sel) => sel.options.length);
    if (optsCount <= 1) {
      try {
        await this.page.screenshot({ path: 'qa-automation/test-results/selecionarColaborador-no-options.png', fullPage: true });
      } catch (e) {}
      throw new Error('Select de colaboradores não tem opções carregadas. Verifique /api/employees e o seeding dos dados.');
    }
    // Select the option by exact visible text to avoid partial matches (e.g. 'Ana' in 'Diana')
    const foundValue = await this.selectColaborador.evaluate((sel, expected) => {
      const opt = Array.from(sel.options).find(o => o.text === expected);
      if (opt) {
        sel.value = opt.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        return opt.value;
      }
      return null;
    }, nome);
    if (!foundValue) {
      // capture screenshot to help debugging
      throw new Error(`Opção com texto exato "${nome}" não encontrada no select de colaboradores.`);
    }
  }

  async abrirPrimeiraAvaliacao() {
    await this.page.getByRole('button', { name: /^Responder$/ }).first().click();
    await expect(this.btnEnviar).toBeVisible();
  }

  async abrirAvaliacaoPorCiclo(nomeCiclo) {
    const card = this.page.locator('div[style*="border-bottom: 1px solid var(--border)"]', {
      hasText: nomeCiclo,
    }).first();
    await expect(card).toBeVisible({ timeout: 15000 });
    await card.getByRole('button', { name: /^Responder$/ }).click();
    await expect(this.btnEnviar).toBeVisible();
  }

  async preencherNotas(nota) {
    const selects = this.page.locator('select.score-input');
    const total = await selects.count();

    for (let i = 0; i < total; i++) {
      await selects.nth(i).selectOption(String(nota));
    }
  }

  async enviarRespostas() {
    await expect(this.btnEnviar).toBeVisible();
    await this.btnEnviar.click();
    await this.page.waitForFunction(() => {
      return !!document.querySelector('.alert.success') || !!document.querySelector('.alert.error');
    }, null, { timeout: 10000 });
  }

  async verificarConcluida() {
    await expect(this.page.locator('.alert.success')).toContainText(
      'Avaliação respondida com sucesso'
    );
  }
}

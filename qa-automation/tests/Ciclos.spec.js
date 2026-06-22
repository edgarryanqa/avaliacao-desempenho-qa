import { test, expect } from '@playwright/test';
import { CiclosPage } from '../pages/CiclosPage.js';
import { buildCyclePayload, buildUniqueName, teamNames, competencyNames } from '../fixtures/data.js';

test.describe('Ciclos', () => {
  let ciclos;

  test.beforeEach(async ({ page }) => {
    ciclos = new CiclosPage(page);
    await ciclos.goto();
  });

  test('CT-007 - Criar ciclo válido em status draft', async () => {
    const validCycle = buildCyclePayload({
      suffix: 'E2E Válido',
      startDays: 1,
      endDays: 180,
      teams: [teamNames.backend],
      competencies: [competencyNames.comunicacao],
    });

    await ciclos.criar(validCycle);
    await ciclos.verificarStatus(validCycle.nome, 'draft');
  });

  test('CT-008 - Criar ciclo com data inicial maior que data final exibe erro', async () => {
    const nomeCiclo = buildUniqueName('Ciclo Data Inválida');

    await ciclos.inputNome.fill(nomeCiclo);
    await ciclos.inputInicio.fill('2027-12-31');
    await ciclos.inputFim.fill('2027-01-01');

    await ciclos.checkCheckboxes([teamNames.backend], 'first');
    await ciclos.checkCheckboxes([competencyNames.comunicacao], 'last');

    await ciclos.btnCadastrar.click();

    await expect(
      ciclos.page.getByText(/invalid_cycle|start_date|end_date/i)
    ).toBeVisible();

    await expect(
      ciclos.page.getByRole('cell', { name: nomeCiclo })
    ).not.toBeVisible();
  });

  test('CT-009 - Ativar ciclo válido altera status para active', async () => {
    const activateCycle = buildCyclePayload({
      suffix: 'Para Ativar',
      startDays: 0,
      endDays: 0,
      teams: [teamNames.backend],
      competencies: [competencyNames.comunicacao],
    });

    await ciclos.criar(activateCycle);

    await ciclos.iniciarCiclo(activateCycle.nome);

    await ciclos.verificarStatus(activateCycle.nome, 'active');
  });

  test('CT-010 - Iniciar ciclo com pesos que não somam 100 exibe erro', async () => {
    const hoje = new Date().toLocaleDateString('sv-SE');
    const nomeCiclo = buildUniqueName('Ciclo Pesos Inválidos');

    await ciclos.inputNome.fill(nomeCiclo);
    await ciclos.inputInicio.fill(hoje);
    await ciclos.inputFim.fill(hoje);

    // Time participante
    await ciclos.checkCheckboxes([teamNames.backend], 'first');

    // Habilita pesos
    await ciclos.checkboxPesos.check();

    // Competências
    await ciclos.checkCheckboxes(
      [competencyNames.comunicacao, competencyNames.entrega],
      'last'
    );

    // Soma inválida = 120
    const pesos = ciclos.page.getByPlaceholder(/peso/i);

    await pesos.nth(0).fill('60');
    await pesos.nth(1).fill('60');

    await ciclos.btnCadastrar.click();

    // Ciclo deve ser criado em draft
    await ciclos.verificarStatus(nomeCiclo, 'draft');

    // Tenta iniciar
    await ciclos.iniciarCiclo(nomeCiclo);

    // Regra do desafio:
    // pesos ≠ 100 => invalid_cycle_config
    await expect(
      ciclos.page.getByText(/invalid_cycle_config/i)
    ).toBeVisible();

  // Continua draft
  await ciclos.verificarStatus(nomeCiclo, 'draft');
});
});
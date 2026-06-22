import { test, expect } from '@playwright/test';
import { CompetenciasPage } from '../pages/CompetenciasPage.js';
import { competencyNames } from '../fixtures/data.js';

test.describe('Competências', () => {
  let competencias;

  test.beforeEach(async ({ page }) => {
    competencias = new CompetenciasPage(page);
    await competencias.goto();
  });

  test('CT-001 - Criar competência válida', async () => {
    await competencias.criar(competencyNames.lideranca);
    await competencias.verificarNaListagem(competencyNames.lideranca);
  });

  test('CT-002 - Criar competência sem nome exibe validação', async () => {

    await competencias.btnCadastrar.click();

    await expect(competencias.inputNome).toBeFocused();
  });

});
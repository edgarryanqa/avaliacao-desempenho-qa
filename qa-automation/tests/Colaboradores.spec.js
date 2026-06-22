import { test, expect } from '@playwright/test';
import { ColaboradoresPage } from '../pages/ColaboradoresPage.js';
import { buildUniqueName, employeeIds, employeeNames, teamIds } from '../fixtures/data.js';

test.describe('Colaboradores', () => {
  let colaboradores;

  test.beforeEach(async ({ page }) => {
    colaboradores = new ColaboradoresPage(page);
    await colaboradores.goto();
  });

  test('CT-005 - Criar colaborador sem gestor', async () => {
    const nome = buildUniqueName('Fernanda');

    // ID 2 = Back-end (seed)
    await colaboradores.criar(nome, teamIds.backend);
    await colaboradores.verificarNaListagem(nome);
  });

  test('CT-006 - Criar colaborador com gestor vinculado', async () => {
    const nome = buildUniqueName('Roberto');

    // ID 2 = Back-end, ID 1 = Ana (seed)
    await colaboradores.criar(nome, teamIds.backend, employeeIds.ana);
    await colaboradores.verificarNaListagem(nome);
    await colaboradores.verificarColaboradorEGestor(nome, employeeNames.ana);
  });

});
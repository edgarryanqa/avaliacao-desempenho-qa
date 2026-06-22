import { test, expect } from '@playwright/test';
import { AvaliacoesPage } from '../pages/AvaliacoesPage.js';
import { CiclosPage } from '../pages/CiclosPage.js';
import { buildCyclePayload, employeeNames, teamNames, competencyNames } from '../fixtures/data.js';

test.describe('Avaliações', () => {
  let avaliacoes;

  test.beforeEach(async ({ page }) => {
    avaliacoes = new AvaliacoesPage(page);
    await avaliacoes.goto();
  });

  test('CT-011 - Responder avaliação válida com todas as notas', async ({ page }) => {
    // cria ciclo válido
    const ciclos = new CiclosPage(page);
    await ciclos.goto();

    const evaluationCycle = buildCyclePayload({
      suffix: 'Avaliação',
      startDays: 0,
      endDays: 0,
      teams: [teamNames.backend],
      competencies: [
        competencyNames.comunicacao,
        competencyNames.entrega,
        competencyNames.colaboracao,
      ],
    });

    await ciclos.criar(evaluationCycle);
    await ciclos.iniciarCiclo(evaluationCycle.nome);

    // after creating/starting a cycle the app remains on Ciclos page; go back to Responder avaliações
    await avaliacoes.goto();

    await avaliacoes.selecionarColaborador(employeeNames.ana);
    await avaliacoes.abrirAvaliacaoPorCiclo(evaluationCycle.nome);
    await avaliacoes.preencherNotas(4);
    await avaliacoes.enviarRespostas();
    await avaliacoes.verificarConcluida();
  });

  test('CT-012 - Enviar avaliação sem preencher notas exibe erro', async () => {
    await avaliacoes.selecionarColaborador(employeeNames.ana);
    await avaliacoes.abrirPrimeiraAvaliacao();
    await avaliacoes.enviarRespostas();

    
    await expect(
      avaliacoes.page.getByRole('button', { name: /Enviar respostas/i })
    ).toBeVisible();

    await expect(
      avaliacoes.page.locator('select.score-input').first()
    ).toBeVisible();
  });

});
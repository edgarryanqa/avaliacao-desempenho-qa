import { test, expect } from '@playwright/test';
import { TimesPage } from '../pages/TimesPage.js';
import { teamNames, teamIds } from '../fixtures/data.js';

test.describe('Times', () => {
  let times;

  test.beforeEach(async ({ page }) => {
    times = new TimesPage(page);
    await times.goto();
  });

  test('CT-003 - Criar time sem hierarquia (time raiz)', async () => {
    await times.criar(teamNames.qaAutomation);
    await times.verificarNaListagem(teamNames.qaAutomation);
  });

  test('CT-004 - Criar time filho com hierarquia', async () => {
    // ID 1 = Tecnologia (seed)
    await times.criar(teamNames.mobile, teamIds.tecnologia);

    await times.verificarNaListagem(teamNames.mobile);
  });

});
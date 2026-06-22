import { BasePage } from './BasePage.js';

export class CiclosPage extends BasePage {
  constructor(page) {
    super(page);
    this.inputNome = page.getByRole('textbox', { name: 'Ex.: Avaliação Q2/2026' });
    this.inputInicio = page.locator('input[type="date"]').first();
    this.inputFim = page.locator('input[type="date"]').last();
    this.checkboxPesos = page.getByRole('checkbox', { name: /pesos/i });
    this.btnCadastrar = page.getByRole('button', { name: 'Cadastrar ciclo' });
  }

  async goto() {
    await this.gotoSection('Ciclos');
  }

  async criar({ nome, inicio, fim, times = [], competencias = [] }) {
    await this.inputNome.fill(nome);
    await this.inputInicio.fill(inicio);
    await this.inputFim.fill(fim);

    await this.checkCheckboxes(times, 'first');
    await this.checkCheckboxes(competencias, 'last');

    await this.btnCadastrar.click();
  }

  async checkCheckboxes(labels, position = 'first') {
    for (const label of labels) {
      await this.page
        .getByRole('checkbox', { name: label })
        [position]()
        .check();
    }
  }

  async iniciarCiclo(nomeCiclo) {
    await this.rowByText(nomeCiclo)
      .getByRole('button', { name: /iniciar/i })
      .click();
  }

  async verificarStatus(nomeCiclo, status) {
    await this.expectRowContains(nomeCiclo, status);
  }
}
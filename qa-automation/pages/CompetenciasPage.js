import { BasePage } from './BasePage.js';

export class CompetenciasPage extends BasePage {
  constructor(page) {
    super(page);
    this.inputNome = page.getByRole('textbox', { name: 'Ex.: Comunicação' });
    this.btnCadastrar = page.getByRole('button', { name: 'Cadastrar' });
  }

  async goto() {
    await this.gotoSection('Competências');
  }

  async criar(nome) {
    await this.inputNome.fill(nome);
    await this.btnCadastrar.click();
  }

  async verificarNaListagem(nome) {
    await this.expectRowVisible(nome);
  }
}
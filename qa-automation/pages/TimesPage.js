import { BasePage } from './BasePage.js';

export class TimesPage extends BasePage {
  constructor(page) {
    super(page);
    this.inputNome = page.getByRole('textbox', { name: 'Ex.: Back-end' });
    this.selectSuperior = page.getByRole('combobox');
    this.btnCadastrar = page.getByRole('button', { name: 'Cadastrar' });
  }

  async goto() {
    await this.gotoSection('Times');
  }

  async criar(nome, idTimeSuperior = null) {
    await this.inputNome.fill(nome);
    if (idTimeSuperior) {
      await this.selectSuperior.selectOption(String(idTimeSuperior));
    }
    await this.btnCadastrar.click();
  }

  async verificarNaListagem(nome) {
    await this.expectRowVisible(nome);
  }
}
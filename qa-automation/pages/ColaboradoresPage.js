import { BasePage } from './BasePage.js';

export class ColaboradoresPage extends BasePage {
  constructor(page) {
    super(page);
    this.inputNome = page.getByRole('textbox', { name: 'Ex.: Ana' });
    this.selectTime = page.getByRole('combobox').first();
    this.selectGestor = page.getByRole('combobox').last();
    this.btnCadastrar = page.getByRole('button', { name: 'Cadastrar' });
  }

  async goto() {
    await this.gotoSection('Colaboradores');
  }

  async criar(nome, idTime, idGestor = null) {
    await this.inputNome.fill(nome);
    await this.selectTime.selectOption(String(idTime));

    if (idGestor) {
      await this.selectGestor.selectOption(String(idGestor));
    }

    await this.btnCadastrar.click();
  }

  async verificarNaListagem(nome) {
    await this.expectRowVisible(nome);
  }

  async verificarColaboradorEGestor(nome, gestor) {
    await this.expectRowContains(nome, gestor);
  }
}
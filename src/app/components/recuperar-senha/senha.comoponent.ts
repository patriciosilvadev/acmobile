import { Component } from "@angular/core";
import { UsuarioService } from "../../services/usuario-service";
import { UtilService } from "../../services/utilService";
import { Router } from "@angular/router";

@Component({
  selector: "page-senha-component",
  templateUrl: "senha.component.html",
  styleUrls: ["senha.component.css"],
})
export class SenhaComoponent {
  confirmaSenha: string;
  senha: string;
  login: string;

  constructor(
    public router: Router,
    private _service: UsuarioService,
    private _util: UtilService
  ) {}

  resetSenha() {
    if (this.confirmaSenha !== this.senha) {
      this._util.showMessage("Erro!", "Senhas não Conferem.");
      return;
    }
    this._service
      .senha(this.login, this.senha)
      .then((dados) => {
        this._util.showMessage(
          "Sucesso!",
          "Solicitação recebida com sucesso! Foi enviado para seu email a confirmação."
        );
        this.router.navigate(["login"]);
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }
}

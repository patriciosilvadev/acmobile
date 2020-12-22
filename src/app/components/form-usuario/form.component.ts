import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UsuarioService } from "../../services/usuario-service";
import { UtilService } from "../../services/utilService";
import { Global } from "../../Global";

@Component({
  selector: "page-form-conta",
  templateUrl: "form.component.html",
  styleUrls: ["form.component.css"],
})
export class FormContaComponent {
  usuario: any;

  constructor(
    private global: Global,
    public router: Router,
    private _service: UsuarioService,
    private _util: UtilService
  ) {
    if (this.global.usuario) {
      this.usuario = this.global.usuario;
      this.usuario.confirmaSenha = this.usuario.senha;
      this.usuario.listaCnpj = [];
      this.usuario.clientes.forEach((cliente) =>
        this.usuario.listaCnpj.push(cliente.cnpj)
      );
    } else {
      this.usuario = {};
    }
  }

  registrar() {
    if (this.usuario.confirmaSenha !== this.usuario.senha) {
      this._util.showMessage("Erro!", "Senhas não Conferem.");
      return;
    }
    if (!this.usuario.listaCnpj || this.usuario.listaCnpj.length < 1) {
      this._util.showMessage("Erro!", "É necessário adicionar um CNPJ");
      return;
    }

    this._service
      .registrar(this.usuario)
      .then(() => {
        if (this.usuario.id) {
          this._util.showMessage(
            "Sucesso!",
            "Usuário alterado com Sucesso. Caso tenha adicionado algum posto, acesse o AC-Posto para liberação."
          );
        } else {
          this._util.showMessage(
            "Sucesso!",
            "Usuário criado com Sucesso! Acesse o Ac Posto para liberação do uso."
          );
        }
        this.usuario = {};
        this.router.navigate(["login"]);
      })
      .catch((err) => {
        this._util.showMessage("Erro!", err);
      });
  }

  addCnpj() {
    if (!this.usuario.listaCnpj) {
      this.usuario.listaCnpj = [];
    }
    this.usuario.listaCnpj.push(
      this.usuario.cnpj.toString().replace(/[^\d]+/g, "")
    );
    this.usuario.cnpj = "";
  }

  removeCnpj(index) {
    this.usuario.listaCnpj.splice(index, 1);
  }

  cancelar() {
    this.usuario = {};
    this.router.navigate(["home"]);
  }
}

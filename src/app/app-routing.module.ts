import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { CaixaComponent } from "./components/caixa/lista/caixa.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/form/login.component";
import { EstoqueComponent } from "./components/estoque/lista/estoque.component";
import { ContasComponent } from "./components/financeiro/lista/contas.component";
import { LucroComponent } from "./components/lucro/lista/lucro.component";
import { SenhaComoponent } from "./components/recuperar-senha/senha.comoponent";
import { FormContaComponent } from "./components/form-usuario/form.component";
import { VendasCombComponent } from "./components/vendas-comb/lista/vendas-comb.component";
import { VendasComponent } from "./components/vendas/lista/vendas.component";
import { VendasFrentistaComponent } from "./components/vendas-frentista/lista/vendas-frentista.component";
import { ContatosComponent } from "./components/contatos/contatos.component";
import { VendasProdComponent } from "./components/vendas-prod/lista/vendas-prod.component";
import { VendasTotComponent } from "./components/vendas-tot/lista/vendas-tot.component";
import { AlteraPrecoListaComponente } from "./components/altera-preco/lista/altera-preco-lista.componente";
import { AlteraPrecoNovoComponente } from "./components/altera-preco/novo/altera-preco-novo.componente";
import { DreComponent } from "./components/relatorios/dre/dre.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "estoque", component: EstoqueComponent },
  { path: "caixa", component: CaixaComponent },
  { path: "contas", component: ContasComponent },
  { path: "lucro", component: LucroComponent },
  { path: "senha", component: SenhaComoponent },
  { path: "conta", component: FormContaComponent },
  { path: "contatos", component: ContatosComponent },
  {
    path: "relatorios",
    children: [{ path: "dre", component: DreComponent }],
  },
  {
    path: "alterar-preco",
    children: [
      {
        path: "lista",
        component: AlteraPrecoListaComponente,
      },
      {
        path: "novo",
        component: AlteraPrecoNovoComponente,
      },
    ],
  },
  {
    path: "vendas",
    component: VendasComponent,
    children: [
      {
        path: "vendasCTab",
        component: VendasCombComponent,
      },
      {
        path: "vendasFTab",
        component: VendasFrentistaComponent,
      },
      {
        path: "vendasPTab",
        component: VendasProdComponent,
      },
      {
        path: "vendasTTab",
        component: VendasTotComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

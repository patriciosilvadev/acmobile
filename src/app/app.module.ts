import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/storage";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { RouteReuseStrategy } from "@angular/router";
import { NgHttpLoaderModule } from "ng-http-loader";
import { Global } from "./Global";
import { EstoqueService } from "./services/estoque-service";
import { LucroService } from "./services/lucro-service";
import { ContasService } from "./services/contas-service";
import { VendasService } from "./services/vendas-service";
import { HttpService } from "./services/httpService";
import { UtilService } from "./services/utilService";
import { UsuarioService } from "./services/usuario-service";
import { CaixaService } from "./services/caixa-service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { LoginComponent } from "./components/login/form/login.component";
import { HomeComponent } from "./components/home/home.component";
import { EstoqueComponent } from "./components/estoque/lista/estoque.component";
import { CaixaComponent } from "./components/caixa/lista/caixa.component";
import { BicosService } from "./services/bicos-service";
import { AlteracaoPrecoService } from "./services/alteracaoPreco-service";
import { ContasComponent } from "./components/financeiro/lista/contas.component";
import { LucroComponent } from "./components/lucro/lista/lucro.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SenhaComoponent } from "./components/recuperar-senha/senha.comoponent";
import { FormContaComponent } from "./components/form-usuario/form.component";
import { VendasComponent } from "./components/vendas/lista/vendas.component";
import { VendasCombComponent } from "./components/vendas-comb/lista/vendas-comb.component";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { VendasFrentistaComponent } from "./components/vendas-frentista/lista/vendas-frentista.component";
import { ContatosComponent } from "./components/contatos/contatos.component";
import { Ionic4DatepickerModule } from "@logisticinfotech/ionic4-datepicker";
import { BrMaskerModule } from "br-mask";
import { registerLocaleData } from "@angular/common";
import localePtBr from "@angular/common/locales/pt";
import { VendasProdComponent } from "./components/vendas-prod/lista/vendas-prod.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { VendasTotComponent } from "./components/vendas-tot/lista/vendas-tot.component";
import { TabService } from "./services/tab-service";
import { AlteraPrecoListaComponente } from "./components/altera-preco/lista/altera-preco-lista.componente";
import { AlteraPrecoNovoComponente } from "./components/altera-preco/novo/altera-preco-novo.componente";
import { AlteraPrecoModalComponente } from "./components/altera-preco/modal/altera-preco-modal.componente";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { DreComponent } from "./components/relatorios/dre/dre.component";
import { FiltroDataComponent } from './components/relatorios/dre/filtro-data/filtro-data.component';
import { ChartsModule } from 'ng2-charts';
import { DreService } from './services/dre.service';
import { VendasDreComponent } from "./components/relatorios/dre/modal/vendas-dre/vendas-dre.component";
import { CustosDreComponent } from "./components/relatorios/dre/modal/custos-dre/custos-dre.component";
import { OutrasReceitasModalComponent } from "./components/relatorios/dre/modal/outras-receitas/outras-receitas.component";
import { DespesasModalComponent } from "./components/relatorios/dre/modal/despesas/despesas.component";

registerLocaleData(localePtBr, "pt");

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EstoqueComponent,
    CaixaComponent,
    ContasComponent,
    LucroComponent,
    SenhaComoponent,
    FormContaComponent,
    VendasComponent,
    VendasCombComponent,
    VendasProdComponent,
    VendasTotComponent,
    VendasFrentistaComponent,
    AlteraPrecoListaComponente,
    AlteraPrecoNovoComponente,
    AlteraPrecoModalComponente,
    ContatosComponent,
    DreComponent,
    FiltroDataComponent,
    VendasDreComponent,
    CustosDreComponent,
    OutrasReceitasModalComponent,
    DespesasModalComponent,
  ],
  entryComponents: [
    AlteraPrecoModalComponente,
    FiltroDataComponent,
    VendasDreComponent,
    CustosDreComponent,
    OutrasReceitasModalComponent,
    DespesasModalComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    NgxChartsModule,
    Ng2GoogleChartsModule,
    Ionic4DatepickerModule,
    BrMaskerModule,
    IonicModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    //Services
    UsuarioService,
    CaixaService,
    VendasService,
    UtilService,
    HttpService,
    HttpClientModule,
    Global,
    EstoqueService,
    LucroService,
    BicosService,
    AlteracaoPrecoService,
    ContasService,
    TabService,
    DreService,
    //Native
    SplashScreen,
    StatusBar,
    ScreenOrientation,
    FCM,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: "pt" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

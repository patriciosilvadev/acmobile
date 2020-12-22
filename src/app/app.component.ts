import { Component, QueryList, ViewChildren } from "@angular/core";

import {
  AlertController,
  IonRouterOutlet,
  MenuController,
  Platform,
} from "@ionic/angular";
import { UtilService } from "./services/utilService";
import { Global } from "./Global";
import { Router } from "@angular/router";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Storage } from "@ionic/storage";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
})
export class AppComponent {
  public alertShown: boolean = false;
  private niceblue: string = "#4a5568";

  public paginas = [
    { titulo: "Vendas", componente: "/vendas", icone: "cart", color: this.niceblue },
    {
      titulo: "Estoque",
      componente: "/estoque",
      src: "assets/ios-analytics.svg",
      color: this.niceblue,
    },
    { titulo: "Caixa", componente: "/caixa", icone: "newspaper", color: this.niceblue },
    {
      titulo: "Lucro",
      componente: "/lucro",
      icone: "trending-up",
      color: this.niceblue,
    },
    {
      titulo: "Alterar Preço",
      componente: "/alterar-preco",
      icone: "swap-horizontal",
      color: this.niceblue,
    },
    {
      titulo: "Financeiro",
      componente: "/contas",
      icone: "cash",
      color: this.niceblue,
    },
    {
      titulo: "Contatos",
      componente: "/contatos",
      icone: "call",
      color: this.niceblue,
    },
    { titulo: "Usuário", componente: "/conta", icone: "person", color: this.niceblue },
  ];

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    public alertCtrl: AlertController,
    private _util: UtilService,
    public global: Global,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    public menuCtrl: MenuController,
    private storage: Storage,
    private fcm: FCM
  ) {
    this.backButtonEvent();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.getToken();
    });
  }

  getToken() {
    this.fcm.getToken().then((token) => {
      this.global.token = token;
    });
    this.fcm.onTokenRefresh().subscribe((token) => {
      this.global.token = token;
    });
    this.fcm.requestPushPermission({
      ios9Support: {
        timeout: 10, // How long it will wait for a decision from the user before returning `false`
        interval: 0.3, // How long between each permission verification
      },
    });
    this.fcm.onNotification().subscribe((data) => {
      console.log(data);
      if (!data.wasTapped) {
        this._util.showMessage(data.title, data.body);
      }
    });
  }

  abrePagina(pagina) {
    if (pagina.titulo === "Alterar Preço") {
      this._util.showMessage(
        "Aviso!",
        "Está função estará disponivel em breve!"
      );
    } else {
      this.router.navigate([pagina.componente]);
      this.menuCtrl.toggle();
    }
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(999990, () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (this.router.url === "/home") {
          this.presentConfirm(false);
        } else if (outlet && outlet.canGoBack()) {
          outlet.pop();
        }
      });
    });
  }

  async presentConfirm(deleta) {
    let alert = await this.alertCtrl.create({
      header: "Confirmação",
      message: "Deseja Sair do Sistema?",
      buttons: [
        {
          text: "Cancela",
          role: "cancel",
          handler: () => {
            this.alertShown = false;
          },
        },
        {
          text: "Sim",
          handler: () => {
            if (deleta) {
              this.storage.remove(`usario`);
              this.storage.set(`login`, this.global.usuario.login);
            }
            navigator["app"].exitApp();
          },
        },
      ],
    });
    await alert.present().then(() => {
      this.alertShown = true;
    });
  }
}

import {Component} from '@angular/core';

@Component({
  selector: 'page-contatos',
  templateUrl: 'contatos.component.html',
  styleUrls: ['contatos.component.css']
})

export class ContatosComponent {

  constructor() {}
  whats(numero){
    window.open('https://api.whatsapp.com/send?phone=55'+numero,"_system");
  }
}

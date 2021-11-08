import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  captcha: boolean;
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
    this.captcha = false;
  }

  ngOnInit(): void {
    alert("Vous entrez sur une page administrative !");
  }

  resolved() {
    this.captcha = true;
  }

  processForm() {
    this.notifier.notify('error', 'Erreur lors de la connexion !');
  }
}



import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";
import {Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-shield',
  templateUrl: './shield.component.html'
})
export class ShieldComponent implements OnInit {
  status: boolean = true;
  servers: number = 0;
  protected: number = 0;
  total: number = 0;

  constructor(public i18n: I18nService, private titleService: Title, private httpClient: HttpClient) {
    this.update();
  }

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • " + (this.i18n.isFrench ? "Shield" : "Bouclier"));
  }

  update(): void {
    this.total = 0;

    this.total += this.getOnline("play.firstsky.fr");
  }

  getOnline(ip: string): number {
    this.httpClient.get("https://api.mcsrvstat.us/2/" + ip).subscribe(res => {
      if (res != null) {
        // @ts-ignore
        return res["players"]["online"];
      }
    });

    return 0;
  }

}

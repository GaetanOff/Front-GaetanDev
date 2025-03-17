import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {TempladminComponent} from "../../../../include/admin/templadmin/templadmin.component";
import {
  DetailsServerSkeletonsComponent
} from "../../../../include/skeletons/details-server-skeletons/details-server-skeletons.component";

@Component({
  selector: 'app-detailserver',
  imports: [
    NgClass,
    NgIf,
    RouterLink,
    TempladminComponent,
    DetailsServerSkeletonsComponent
  ],
  templateUrl: './detailserver.component.html',
  styleUrl: './detailserver.component.css'
})
export class DetailserverComponent {
  isLoading: boolean = true;
  serverId!: number;
  serverDetails: any;
  showIp: boolean = false;

  private serverList = [
    { id: 1, status: 'online', cpu: 45, ram: 70, disk: 30, swap: 5, incomingNetwork: 150, outgoingNetwork: 75, ip: '192.168.1.1', location: 'France' },
    { id: 2, status: 'offline', cpu: 30, ram: 50, disk: 30, swap: 5, incomingNetwork: 120, outgoingNetwork: 60, ip: '192.168.1.2', location: 'USA' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    this.route.params.subscribe(params => {
      this.serverId = +params['id'];
      this.serverDetails = this.serverList.find(server => server.id === this.serverId);
    });
  }

  async toggleIp() {
    this.showIp = !this.showIp;
  }
}

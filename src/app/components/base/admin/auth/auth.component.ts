import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {AdminService} from "../../../../services/admin/admin.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  username: string | undefined;
  password: string | undefined;

  constructor(private notifierService: NotifierService, private adminService: AdminService) {
  }

  ngOnInit(): void {
  }

  processForm() {
    const {username, password} = this;

    if (username === undefined || password === undefined) {
      this.notifierService.notify('error', 'Invalid form');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    this.adminService.login(formData);
  }

}

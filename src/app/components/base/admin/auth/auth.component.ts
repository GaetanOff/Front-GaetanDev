import {Component, OnInit} from '@angular/core';
import { toast } from 'ngx-sonner';
import {AdminService} from "../../../../services/admin/admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  protected readonly toast = toast;

  username: string | undefined;
  password: string | undefined;

  constructor(private adminService: AdminService, private router: Router) {
  }

  ngOnInit(): void {
  }

  async processForm(): Promise<void> {
    const {username, password} = this;

    if (username === undefined || password === undefined) {
      this.toast.error('Invalid form');
      return;
    }

    const lastToast: string | number = toast.loading("Connecting...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    this.adminService.login(formData).subscribe((success: boolean) => {
      if (success) {
        toast.success("Successfully connected.", { id: lastToast });
        this.router.navigate(['/admin']).then(() => console.log('Navigated to admin'));
      } else {
        toast.error("Failed to connect.", { id: lastToast });
      }
    });
  }

}

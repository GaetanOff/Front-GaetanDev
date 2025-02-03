import { Component, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { AdminService } from "../../../../services/admin/admin.service";
import { Router } from "@angular/router";
import { z } from "zod";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  protected readonly toast = toast;

  mpdmldpsmzl: string | null = null;
  mpmkmpkbgyijnhipm: string = "0x4AAAAAAAQVPyoNLB-x1-gG";

  username: string = "";
  password: string = "";

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {}

  hgfyjbvfddibbdguo(event: string | null) {
    this.mpdmldpsmzl = event;
  }

  private authSchema = z.object({
    username: z.string()
      .min(3, "Username must be at least 3 characters long."),
    password: z.string()
      .min(6, "Password must be at least 6 characters long."),
    captcha: z.string().nullable()
      .refine(value => value !== null, { message: "Please verify the captcha." })
  });

  async processForm(): Promise<void> {
    const { username, password, mpdmldpsmzl } = this;

    const validationResult = this.authSchema.safeParse({ username, password, captcha: mpdmldpsmzl });

    if (!validationResult.success) {
      validationResult.error.errors.forEach(err => {
        this.toast.error(err.message);
      });
      return;
    }

    const lastToast: string | number = toast.loading("Connecting...");
    await new Promise(resolve => setTimeout(resolve, 1000));

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

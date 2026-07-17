import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { toast } from 'ngx-sonner';
import { Subject } from 'rxjs';
import { z } from 'zod';

import { SkeletonComponent } from '../../../include/skeletons/skeleton.component';
import { TempladminComponent } from '../../../include/admin/templadmin/templadmin.component';
import { FormsModule } from '@angular/forms';
import { AdminEmail, AdminMutationResponse, EmailWordsResponse } from '../../../../types';
import { runRefreshLoad, startPolling } from '../../../../utils/polling.utils';

@Component({
  selector: 'app-email',
  imports: [
    FormsModule,
    TempladminComponent,
    SkeletonComponent
  ],
  templateUrl: './email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent implements OnInit, OnDestroy {
  emailName: string = '';
  description: string = '';
  filterText: string = '';

  readonly emails = signal<AdminEmail[]>([]);
  readonly isLoadingEmails = signal(false);
  readonly isSubmitting = signal(false);
  readonly removingEmail = signal<string | null>(null);
  readonly wordsLoaded = signal(false);

  private firstWords: string[] = [];
  private secondWords: string[] = [];

  get filteredEmails(): AdminEmail[] {
    const list = this.emails();
    const filter = this.filterText.trim().toLowerCase();
    if (!filter) {
      return list.slice().reverse();
    }
    const matching = list.filter(email =>
      email.nom.toLowerCase().includes(filter) ||
      email.description.toLowerCase().includes(filter)
    );
    const nonMatching = list.filter(email =>
      !(email.nom.toLowerCase().includes(filter) ||
        email.description.toLowerCase().includes(filter))
    );
    return matching.reverse().concat(nonMatching.reverse());
  }

  protected readonly toast = toast;
  private unsubscribe$ = new Subject<void>();
  private adminService = inject(AdminService);

  ngOnInit(): void {
    this.adminService.getEmailsWords().subscribe({
      next: (response: EmailWordsResponse) => {
        this.firstWords = response.firstWords;
        this.secondWords = response.secondWords;
        this.wordsLoaded.set(true);
      },
      error: (error) => {
        console.error("Error fetching email words:", error);
      }
    });

    startPolling(60000, this.unsubscribe$, () => this.updateEmails());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async processForm(): Promise<void> {
    if (!this.emailName.trim() || !this.description.trim()) {
      this.toast.error("Invalid form");
      return;
    }

    const currentEmails = this.emails();
    const aliasSchema = z
      .string()
      .min(1, { message: "Alias cannot be empty" })
      .regex(/^[a-zA-Z0-9._-]+$/, { message: "Invalid alias format" })
      .refine(
        (alias) =>
          !currentEmails.some(
            (e) => e.nom.toLowerCase() === alias.toLowerCase()
          ),
        { message: "Alias already exists." }
      );

    const result = aliasSchema.safeParse(this.emailName.trim());
    if (!result.success) {
      this.toast.error(result.error.errors[0].message);
      return;
    }

    this.isSubmitting.set(true);
    const loadingToast = this.toast.loading("Creating alias email...");

    this.adminService.addEmail(this.emailName.trim(), this.description.trim()).subscribe({
      next: (response: AdminMutationResponse) => {
        if (response && response.success) {
          this.emails.update(emails => [...emails, {
            nom: this.emailName.trim(),
            description: this.description.trim(),
          }]);
          this.toast.success("Alias email created successfully.", { id: loadingToast });
          this.emailName = '';
          this.description = '';
        } else {
          this.toast.error("Failed to create alias email.", { id: loadingToast });
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        this.toast.error("Error occurred while creating alias email.", { id: loadingToast });
        this.isSubmitting.set(false);
      }
    });
  }

  async removeEmail(emailToRemove: AdminEmail): Promise<void> {
    if (this.removingEmail()) {
      this.toast.error("An email removal is already in progress.");
      return;
    }

    this.removingEmail.set(emailToRemove.nom);
    const loadingToast = this.toast.loading("Deleting alias email...");

    this.adminService.removeEmail(emailToRemove.nom).subscribe({
      next: (response: AdminMutationResponse) => {
        if (response && response.success) {
          this.emails.update(emails => emails.filter(email => email.nom !== emailToRemove.nom));
          this.toast.success("Alias email deleted successfully.", { id: loadingToast });
        } else {
          this.toast.error("Failed to delete alias email.", { id: loadingToast });
        }
      },
      error: () => {
        this.toast.error("Error occurred while deleting alias email.", { id: loadingToast });
      },
      complete: () => {
        this.removingEmail.set(null);
      }
    });
  }

  private updateEmails(): void {
    if (this.isLoadingEmails()) return;

    const loadingToast = this.toast.loading("Refreshing alias emails...");

    runRefreshLoad({
      isBusy: () => this.isLoadingEmails(),
      setBusy: (busy) => this.isLoadingEmails.set(busy),
      request: () => this.adminService.getEmails(),
      onSuccess: (response) => {
        this.emails.set(response || []);
      },
      onError: (error) => {
        console.error("Error fetching alias emails:", error);
      },
      loadingToast,
      successToast: (id) => this.toast.success("Alias emails refreshed", { id }),
      errorToast: () => this.toast.error("Error fetching alias emails"),
    });
  }

  generateRandomAlias(): void {
    const separators = ["-", ".", "_"];
    const maxAttempts = 100;
    const currentEmails = this.emails();

    let alias = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      attempts++;
      const A = this.firstWords[Math.floor(Math.random() * this.firstWords.length)];
      const B = this.secondWords[Math.floor(Math.random() * this.secondWords.length)];
      const sep = separators[Math.floor(Math.random() * separators.length)];

      const option = Math.random() < 0.5 ? 1 : 2;
      if (option === 1) {
        const num = Math.floor(Math.random() * 100).toString().padStart(2, "0");
        alias = A + sep + num + B;
      } else {
        const random2 = Array.from({ length: 2 }, () => {
          const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
          return chars.charAt(Math.floor(Math.random() * chars.length));
        }).join("");
        alias = A + sep + B + sep + random2;
      }

      if (!currentEmails.some(e => e.nom.toLowerCase() === alias.toLowerCase())) {
        isUnique = true;
      }
    }

    if (!isUnique) {
      this.toast.error("Unable to generate a unique alias.");
      return;
    }

    this.emailName = alias;
    this.toast.info("Alias aléatoire généré.");
  }
}

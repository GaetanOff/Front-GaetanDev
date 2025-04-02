import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { toast } from 'ngx-sonner';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { z } from 'zod';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { EmailsLoadingSkeletonsComponent } from '../../../include/skeletons/emails-loading-skeletons/emails-loading-skeletons.component';
import { AddEmailSkeletonsComponent } from '../../../include/skeletons/add-email-skeletons/add-email-skeletons.component';
import { TempladminComponent } from '../../../include/admin/templadmin/templadmin.component';
import { FormsModule } from '@angular/forms';
import { RemoveEmailSkeletonsComponent } from '../../../include/skeletons/remove-email-skeletons/remove-email-skeletons.component';

interface Email {
  nom: string;
  description: string;
}

interface WordsResponse {
  firstWords: string[];
  secondWords: string[];
}

@Component({
  selector: 'app-email',
  imports: [
    CommonModule,
    FormsModule,
    NgFor,
    NgIf,
    TempladminComponent,
    EmailsLoadingSkeletonsComponent,
    AddEmailSkeletonsComponent,
    RemoveEmailSkeletonsComponent
  ],
  templateUrl: './email.component.html',
})
export class EmailComponent implements OnInit, OnDestroy {
  emailName: string = '';
  description: string = '';
  emails: Email[] = [];
  filterText: string = '';
  isLoadingEmails: boolean = false;
  isSubmitting: boolean = false;
  removingEmail: string | null = null;
  protected readonly toast = toast;
  private unsubscribe$ = new Subject<void>();

  firstWords: string[] = [];
  secondWords: string[] = [];
  wordsLoaded: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.updateEmails().catch(err =>
      console.error('Error fetching alias emails:', err)
    );

    this.adminService.getEmailsWords().subscribe({
      next: (response: WordsResponse) => {
        this.firstWords = response.firstWords;
        this.secondWords = response.secondWords;
        this.wordsLoaded = true;
      },
      error: (error) => {
        console.error("Error fetching email words:", error);
        // Vous pouvez éventuellement définir un fallback ici
      }
    });

    interval(60000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.updateEmails());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get filteredEmails(): Email[] {
    if (!this.filterText.trim()) {
      return this.emails.slice().reverse();
    }
    const filterLower = this.filterText.trim().toLowerCase();
    const matching = this.emails.filter(email =>
      email.nom.toLowerCase().includes(filterLower) ||
      email.description.toLowerCase().includes(filterLower)
    );
    const nonMatching = this.emails.filter(email =>
      !(email.nom.toLowerCase().includes(filterLower) ||
        email.description.toLowerCase().includes(filterLower))
    );
    return matching.reverse().concat(nonMatching.reverse());
  }

  async processForm(): Promise<void> {
    if (!this.emailName.trim() || !this.description.trim()) {
      this.toast.error("Invalid form");
      return;
    }

    const aliasSchema = z
      .string()
      .min(1, { message: "Alias cannot be empty" })
      .regex(/^[a-zA-Z0-9._-]+$/, { message: "Invalid alias format" })
      .refine(
        (alias) =>
          !this.emails.some(
            (e) => e.nom.toLowerCase() === alias.toLowerCase()
          ),
        { message: "Alias already exists." }
      );

    const result = aliasSchema.safeParse(this.emailName.trim());
    if (!result.success) {
      this.toast.error(result.error.errors[0].message);
      return;
    }

    this.isSubmitting = true;
    const loadingToast = this.toast.loading("Creating alias email...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.addEmail(this.emailName.trim(), this.description.trim()).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.emails.push({
            nom: this.emailName.trim(),
            description: this.description.trim(),
          });
          this.toast.success("Alias email created successfully.", { id: loadingToast });
          this.emailName = '';
          this.description = '';
        } else {
          this.toast.error("Failed to create alias email.", { id: loadingToast });
        }
        this.isSubmitting = false;
      },
      error: () => {
        this.toast.error("Error occurred while creating alias email.", { id: loadingToast });
        this.isSubmitting = false;
      }
    });
  }

  async removeEmail(emailToRemove: Email): Promise<void> {
    if (this.removingEmail) {
      this.toast.error("An email removal is already in progress.");
      return;
    }

    this.removingEmail = emailToRemove.nom;
    const loadingToast = this.toast.loading("Deleting alias email...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.removeEmail(emailToRemove.nom).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.emails = this.emails.filter(email => email.nom !== emailToRemove.nom);
          this.toast.success("Alias email deleted successfully.", { id: loadingToast });
        } else {
          this.toast.error("Failed to delete alias email.", { id: loadingToast });
        }
      },
      error: () => {
        this.toast.error("Error occurred while deleting alias email.", { id: loadingToast });
      },
      complete: () => {
        this.removingEmail = null;
      }
    });
  }

  private async updateEmails(): Promise<void> {
    if (this.isLoadingEmails) return;
    this.isLoadingEmails = true;
    const loadingToast = this.toast.loading("Refreshing alias emails...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.adminService.getEmails().subscribe({
      next: (response: Email[]) => {
        this.emails = response || [];
        this.toast.success("Alias emails refreshed", { id: loadingToast });
      },
      error: (error) => {
        this.toast.error("Error fetching alias emails");
        console.error("Error fetching alias emails:", error);
      },
      complete: () => {
        this.isLoadingEmails = false;
      }
    });
  }

  generateRandomAlias(): void {
    const separators = ["-", ".", "_"];

    let alias = "";
    let isUnique = false;

    while (!isUnique) {
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

      if (!this.emails.some(e => e.nom.toLowerCase() === alias.toLowerCase())) {
        isUnique = true;
      }
    }

    this.emailName = alias;
    this.toast.info("Alias aléatoire généré.");
  }
}

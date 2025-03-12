import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-corrector',
  templateUrl: './corrector.component.html',
  standalone: false
})
export class CorrectorComponent {
  text: string = '';
  correctedText: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  async correctText(): Promise<void> {
    if (!this.text.trim()) return;

    this.isLoading = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.http.post<{ corrected: string }>('https://api.mistral.ai/correct', { text: this.text })
      .subscribe({
        next: response => {
          this.correctedText = response.corrected;
          this.isLoading = false;
        },
        error: () => {
          this.correctedText = 'Error correcting text';
          this.isLoading = false;
        }
      });
  }
}

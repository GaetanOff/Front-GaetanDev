import { Component, signal, computed, inject, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewChecked, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { I18nService } from '../../../services/i18n/i18n.service';
import { CustomCaptchaComponent } from '../captcha/custom-captcha.component';
import { environment } from '../../../../environments/environment';

interface ChatMessage {
  content: string;
  htmlContent?: SafeHtml;
  isUser: boolean;
  timestamp: Date;
}

interface HistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomCaptchaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  public i18n = inject(I18nService);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  private _isOpen = signal<boolean>(false);
  private _messages = signal<ChatMessage[]>([]);
  private _isLoading = signal<boolean>(false);

  private _chatHistory = signal<HistoryMessage[]>([]);

  // Captcha & session state
  private _isCaptchaVerified = signal<boolean>(false);
  private _captchaError = signal<boolean>(false);
  private _captchaLoading = signal<boolean>(false);
  private _sessionToken = signal<string | null>(null);

  public isOpen = computed(() => this._isOpen());
  public messages = computed(() => this._messages());
  public isLoading = computed(() => this._isLoading());
  public isCaptchaVerified = computed(() => this._isCaptchaVerified());
  public captchaError = computed(() => this._captchaError());
  public captchaLoading = computed(() => this._captchaLoading());

  public userInput = '';

  private readonly API_URL = environment.chatbotApiUrl;
  private shouldScroll = false;

  constructor() {
    effect(() => {
      const currentText = this.i18n.text();
      const currentMessages = this._messages();

      if (currentMessages.length > 0 && !currentMessages[0].isUser) {
        const newWelcomeMessage = currentText.chatbot.welcome;
        if (currentMessages[0].content !== newWelcomeMessage) {
          this._messages.update(messages => {
            const updated = [...messages];
            updated[0] = this.createBotMessage(newWelcomeMessage);
            return updated;
          });
        }
      }
    });
  }

  async onCaptchaResolved(token: string | null): Promise<void> {
    if (!token) {
      this._captchaError.set(true);
      this._isCaptchaVerified.set(false);
      return;
    }

    this._captchaLoading.set(true);
    this._captchaError.set(false);

    try {
      const response = await firstValueFrom(
        this.http.post<{ sessionToken: string }>(
          `${this.API_URL}/verify`,
          { captchaToken: token }
        )
      );

      if (response?.sessionToken) {
        this._sessionToken.set(response.sessionToken);
        this._isCaptchaVerified.set(true);

        this._messages.set([this.createBotMessage(this.i18n.text().chatbot.welcome)]);
        this.shouldScroll = true;
      } else {
        this._captchaError.set(true);
      }
    } catch (error) {
      console.error('Captcha verification error:', error);
      this._captchaError.set(true);
      this._isCaptchaVerified.set(false);
    } finally {
      this._captchaLoading.set(false);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this._isOpen.update(value => !value);
  }

  clearConversation(): void {
    this._messages.set([this.createBotMessage(this.i18n.text().chatbot.welcome)]);
    this._chatHistory.set([]);
    this.shouldScroll = true;
  }

  async sendMessage(): Promise<void> {
    const message = this.userInput.trim();
    if (!message || this._isLoading() || !this._isCaptchaVerified()) return;

    this._messages.update(messages => [...messages, {
      content: message,
      isUser: true,
      timestamp: new Date()
    }]);

    this.userInput = '';
    this._isLoading.set(true);
    this.shouldScroll = true;

    try {
      const response = await firstValueFrom(
        this.http.post<{ reply: string }>(this.API_URL, {
          message: message,
          history: this._chatHistory(),
          sessionToken: this._sessionToken()
        })
      );

      if (response?.reply) {
        const botReply = response.reply.trim();

        this._messages.update(messages => [...messages, this.createBotMessage(botReply)]);

        this._chatHistory.update(history => [
          ...history,
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: botReply }] }
        ]);
      }
    } catch (error: unknown) {
      console.error('Chatbot API error:', error);

      const status = (error as { status?: number })?.status;
      if (status === 403) {
        this._isCaptchaVerified.set(false);
        this._sessionToken.set(null);
        this._captchaError.set(true);
        this._messages.update(messages => messages.slice(0, -1));
      } else {
        this._messages.update(messages => [
          ...messages,
          this.createBotMessage(this.i18n.text().chatbot.error)
        ]);
      }
    } finally {
      this._isLoading.set(false);
      this.shouldScroll = true;
    }
  }

  private createBotMessage(content: string): ChatMessage {
    return {
      content,
      htmlContent: this.toSafeHtml(content),
      isUser: false,
      timestamp: new Date()
    };
  }

  private toSafeHtml(content: string): SafeHtml {
    const html = marked.parse(content, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(DOMPurify.sanitize(html));
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}

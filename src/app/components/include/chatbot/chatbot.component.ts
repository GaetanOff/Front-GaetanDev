import { Component, signal, computed, inject, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewChecked, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../../../services/i18n/i18n.service';
import { CustomCaptchaComponent } from '../captcha/custom-captcha.component';

interface ChatMessage {
  content: string;
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
  template: `
    <button
      (click)="toggleChat()"
      [attr.aria-label]="i18n.text().chatbot.toggle"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full ios-btn flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
      [class.scale-0]="isOpen()"
      [class.scale-100]="!isOpen()">
      <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>

    @if (isOpen()) {
      <div class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] z-50 h-[70vh] max-h-[500px] flex flex-col rounded-3xl ios-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-semibold text-sm">{{ i18n.text().chatbot.title }}</h3>
              <p class="text-white/60 text-xs">{{ i18n.text().chatbot.subtitle }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              (click)="clearConversation()"
              [attr.aria-label]="i18n.text().chatbot.clear"
              [disabled]="messages().length <= 1 || !isCaptchaVerified()"
              class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <button
              (click)="toggleChat()"
              [attr.aria-label]="i18n.text().chatbot.close"
              class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div #messagesContainer class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          @if (!isCaptchaVerified()) {
            <div class="flex flex-col items-center justify-center h-full space-y-4 px-2">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400/20 to-green-500/20 flex items-center justify-center mb-2">
                @if (captchaLoading()) {
                  <svg class="w-8 h-8 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                } @else {
                  <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                }
              </div>
              <h4 class="text-white font-medium text-center">
                {{ captchaLoading() ? i18n.text().chatbot.captchaVerifying : i18n.text().chatbot.captchaTitle }}
              </h4>
              <p class="text-white/60 text-sm text-center leading-relaxed">{{ i18n.text().chatbot.captchaDescription }}</p>
              
              @if (!captchaLoading()) {
                <div class="pt-2 w-full flex justify-center">
                  <app-custom-captcha
                    (tokenResolved)="onCaptchaResolved($event)">
                  </app-custom-captcha>
                </div>
              }

              @if (captchaError()) {
                <p class="text-red-400 text-sm text-center">{{ i18n.text().chatbot.captchaError }}</p>
              }
            </div>
          } @else {
            @for (message of messages(); track $index) {
              <div class="flex" [class.justify-end]="message.isUser" [class.justify-start]="!message.isUser">
                <div 
                  class="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm"
                  [class.bg-gradient-to-r]="message.isUser"
                  [class.from-teal-500]="message.isUser"
                  [class.to-green-500]="message.isUser"
                  [class.text-white]="message.isUser"
                  [class.bg-white/10]="!message.isUser"
                  [class.text-white/90]="!message.isUser"
                  [class.rounded-br-md]="message.isUser"
                  [class.rounded-bl-md]="!message.isUser">
                  <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
                </div>
              </div>
            }

            @if (isLoading()) {
              <div class="flex justify-start">
                <div class="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div class="flex gap-1.5">
                    <span class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <div class="p-4 border-t border-white/10">
          <form (ngSubmit)="sendMessage()" class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="userInput"
              name="userInput"
              [placeholder]="isCaptchaVerified() ? i18n.text().chatbot.placeholder : i18n.text().chatbot.captchaPlaceholder"
              [disabled]="isLoading() || !isCaptchaVerified()"
              class="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              [disabled]="isLoading() || !userInput.trim() || !isCaptchaVerified()"
              [attr.aria-label]="i18n.text().chatbot.send"
              class="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
          <p class="text-white/50 text-[10px] text-center mt-2 italic">{{ i18n.text().chatbot.disclaimer }}</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  public i18n = inject(I18nService);
  private http = inject(HttpClient);
  
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
  
  private readonly API_URL = 'https://api-ia-chatbot-portfolio.gaetandev.fr';
  private shouldScroll = false;

  constructor() {
    // Update welcome message when language changes
    effect(() => {
      // Access i18n.text() to track changes
      const currentText = this.i18n.text();
      const currentMessages = this._messages();
      
      // If there's at least one message and it's the welcome message (first message, not from user)
      if (currentMessages.length > 0 && !currentMessages[0].isUser) {
        // Check if it's the welcome message by comparing with current welcome text
        // We'll update it if the language changed
        const newWelcomeMessage = currentText.chatbot.welcome;
        if (currentMessages[0].content !== newWelcomeMessage) {
          // Update the first message (welcome message) with new language
          this._messages.update(messages => {
            const updated = [...messages];
            updated[0] = {
              content: newWelcomeMessage,
              isUser: false,
              timestamp: new Date()
            };
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
      // Échanger le token Turnstile contre un token de session (valide 30 min)
      const response = await this.http.post<{ sessionToken: string }>(
        `${this.API_URL}/verify`,
        { captchaToken: token }
      ).toPromise();

      if (response?.sessionToken) {
        this._sessionToken.set(response.sessionToken);
        this._isCaptchaVerified.set(true);
        
        // Add welcome message after captcha verification
        this._messages.set([{
          content: this.i18n.text().chatbot.welcome,
          isUser: false,
          timestamp: new Date()
        }]);
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
    // Welcome message is now added after captcha verification in onCaptchaResolved()
  }

  clearConversation(): void {
    this._messages.set([{
      content: this.i18n.text().chatbot.welcome,
      isUser: false,
      timestamp: new Date()
    }]);
    this._chatHistory.set([]);
    this.shouldScroll = true;
  }

  async sendMessage(): Promise<void> {
    const message = this.userInput.trim();
    if (!message || this._isLoading() || !this._isCaptchaVerified()) return;

    // Add user message
    this._messages.update(messages => [...messages, {
      content: message,
      isUser: true,
      timestamp: new Date()
    }]);
    
    this.userInput = '';
    this._isLoading.set(true);
    this.shouldScroll = true;

    try {
      const response = await this.http.post<{ reply: string }>(this.API_URL, {
        message: message,
        history: this._chatHistory(),
        sessionToken: this._sessionToken()
      }).toPromise();

      if (response?.reply) {
        const botReply = response.reply.trim();
        
        this._messages.update(messages => [...messages, {
          content: botReply,
          isUser: false,
          timestamp: new Date()
        }]);

        this._chatHistory.update(history => [
          ...history,
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: botReply }] }
        ]);
      }
    } catch (error: any) {
      console.error('Chatbot API error:', error);
      
      // Si erreur 403 (session expirée ou invalide), réafficher le captcha
      if (error?.status === 403) {
        this._isCaptchaVerified.set(false);
        this._sessionToken.set(null);
        this._captchaError.set(true);
        // Retirer le dernier message utilisateur (celui qui a échoué)
        this._messages.update(messages => messages.slice(0, -1));
      } else {
        this._messages.update(messages => [...messages, {
          content: this.i18n.text().chatbot.error,
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } finally {
      this._isLoading.set(false);
      this.shouldScroll = true;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}

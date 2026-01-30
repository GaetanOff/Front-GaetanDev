import { Component, signal, computed, inject, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewChecked, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../../../services/i18n/i18n.service';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
              [disabled]="messages().length <= 1"
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
        </div>

        <div class="p-4 border-t border-white/10">
          <form (ngSubmit)="sendMessage()" class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="userInput"
              name="userInput"
              [placeholder]="i18n.text().chatbot.placeholder"
              [disabled]="isLoading()"
              class="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              [disabled]="isLoading() || !userInput.trim()"
              [attr.aria-label]="i18n.text().chatbot.send"
              class="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
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
  
  public isOpen = computed(() => this._isOpen());
  public messages = computed(() => this._messages());
  public isLoading = computed(() => this._isLoading());
  
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

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this._isOpen.update(value => !value);
    
    // Add welcome message if opening for first time
    if (this._isOpen() && this._messages().length === 0) {
      this._messages.set([{
        content: this.i18n.text().chatbot.welcome,
        isUser: false,
        timestamp: new Date()
      }]);
      this.shouldScroll = true;
    }
  }

  clearConversation(): void {
    this._messages.set([{
      content: this.i18n.text().chatbot.welcome,
      isUser: false,
      timestamp: new Date()
    }]);
    this.shouldScroll = true;
  }

  async sendMessage(): Promise<void> {
    const message = this.userInput.trim();
    if (!message || this._isLoading()) return;

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
        message: message
      }).toPromise();

      if (response?.reply) {
        this._messages.update(messages => [...messages, {
          content: response.reply.trim(),
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      this._messages.update(messages => [...messages, {
        content: this.i18n.text().chatbot.error,
        isUser: false,
        timestamp: new Date()
      }]);
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

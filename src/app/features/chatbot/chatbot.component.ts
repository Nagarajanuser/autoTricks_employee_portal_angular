import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow rounded-4 d-flex flex-column h-100" style="max-height: 80vh;">
      <div class="card-header bg-primary text-white p-3 rounded-top-4 d-flex align-items-center">
        <i class="fa-solid fa-robot fs-4 me-3"></i>
        <div>
          <h5 class="mb-0 fw-bold">HR Assistant</h5>
          <small class="text-light">Ask me anything about HR policies</small>
        </div>
      </div>
      
      <div class="card-body p-4 bg-light overflow-auto flex-grow-1" #chatBox>
        <div *ngFor="let msg of messages()" class="mb-3 d-flex" [ngClass]="msg.isUser ? 'justify-content-end' : 'justify-content-start'">
          <div class="p-3 rounded-4 shadow-sm markdown-body" style="max-width: 85%;" [ngClass]="msg.isUser ? 'bg-primary text-white' : 'bg-white text-dark border'">
            <div [innerHTML]="renderMarkdown(msg.text)"></div>
            <small [ngClass]="msg.isUser ? 'text-white-50' : 'text-muted'" style="font-size: 0.7rem;">
              {{ msg.timestamp | date:'shortTime' }}
            </small>
          </div>
        </div>
        
        <div *ngIf="isLoading()" class="d-flex justify-content-start mb-3">
          <div class="bg-white p-3 rounded-4 shadow-sm border text-muted">
            <i class="fa-solid fa-circle-notch fa-spin me-2"></i> AI is thinking...
          </div>
        </div>
      </div>
      
      <div class="card-footer bg-white p-3 border-top rounded-bottom-4">
        <div class="input-group">
          <input type="text" class="form-control rounded-pill px-4" placeholder="Type your message..." 
                 [(ngModel)]="userInput" (keyup.enter)="sendMessage()">
          <button class="btn btn-primary rounded-circle ms-2 shadow-sm" type="button" 
                  (click)="sendMessage()" [disabled]="isLoading() || !userInput.trim()"
                  style="width: 45px; height: 45px;">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatbotComponent implements AfterViewChecked {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  @ViewChild('chatBox') private chatBox!: ElementRef;
  
  messages = signal<ChatMessage[]>([
    { text: "Hello! I am your AI HR Assistant. How can I help you today?", isUser: false, timestamp: new Date() }
  ]);
  
  userInput = '';
  isLoading = signal(false);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {}
  }

  renderMarkdown(text: string): SafeHtml {
    const html = marked.parse(text);
    return this.sanitizer.bypassSecurityTrustHtml(html as string);
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading()) return;

    const userMessage = this.userInput.trim();
    this.messages.update(msgs => [...msgs, { text: userMessage, isUser: true, timestamp: new Date() }]);
    this.userInput = '';
    this.isLoading.set(true);

    // Prepare history for the backend (last 10 messages)
    const history = this.messages().slice(-10).map(m => ({
      role: m.isUser ? 'user' : 'assistant',
      content: m.text
    }));

    this.http.post<{reply: string}>('http://localhost:8000/api/v1/chat/message', { 
      message: userMessage,
      history: history
    })
      .subscribe({
        next: (response) => {
          this.messages.update(msgs => [...msgs, { text: response.reply, isUser: false, timestamp: new Date() }]);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.messages.update(msgs => [...msgs, { text: "Sorry, I am having trouble connecting to the server.", isUser: false, timestamp: new Date() }]);
          this.isLoading.set(false);
        }
      });
  }
}

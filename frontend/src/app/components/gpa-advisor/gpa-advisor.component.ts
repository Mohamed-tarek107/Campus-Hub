import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { GpaCalcService } from '../../services/gpaCalc/gpa-calc-service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-gpa-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gpa-advisor.component.html',
  styleUrls: ['./gpa-advisor.component.css']
})
export class GpaAdvisorComponent implements AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(private gpaCalcService: GpaCalcService) {}

  // ── State ─────────────────────────────────────────────
  isOpen = false;
  isTyping = false;
  inputText = '';

  // ── Messages history ──────────────────────────────────
  messages: Message[] = [];
  private lastMessageCount = 0;
  // ── Quick suggestion chips ────────────────────────────
  suggestions = [
    'How can I improve my GPA?',
    'What GPA do I need for graduation?',
    'How are grades calculated?',
    'Tips for exam preparation?',
  ];

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.lastMessageCount) {
    this.scrollToBottom();
    this.lastMessageCount = this.messages.length;
  }
  }

  // ── Toggle chat open/close ────────────────────────────
  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  // ── Send a suggestion chip as a message ───────────────
  sendSuggestion(text: string): void {
    this.inputText = text;
    this.sendMessage();
  }

  // ── Clear chat history ────────────────────────────────
  clearChat(): void {
    this.messages = [];
    this.inputText = '';
  }

  // ── Send message to GPA advisor service ──────────────
  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.isTyping) return;

    const history = this.messages.map(message => ({
      role: message.role === 'assistant' ? 'model' as const : 'user' as const,
      text: message.content,
    }));

    // Add user message
    this.messages.push({ role: 'user', content: text });
    this.inputText = '';
    this.isTyping = true;

    try {
      const response = await firstValueFrom(this.gpaCalcService.chatBot(text, history));
      const reply = response.newHistory[response.newHistory.length - 1]?.text
        || 'Sorry, I could not get a response. Please try again.';

      this.messages.push({ role: 'assistant', content: reply });

    } catch (error) {
      this.messages.push({
        role: 'assistant',
        content: 'Something went wrong. Please check your connection and try again.'
      });
    } finally {
      this.isTyping = false;
    }
  }

  // ── Auto scroll to latest message ────────────────────
  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}